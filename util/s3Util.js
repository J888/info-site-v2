const { appCache, siteFileCacheKey } = require("./nodeCache");
const { S3Client, GetObjectCommand, S3, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3"); // CommonJS import
const { fakeSiteConfig } = require("./fakeDataUtil");
const REGION = 'us-east-2';
const client = new S3Client({ region: REGION });
const SITE_CONFIG_FILE_NAME = 'siteConfig.json';

/**
 * Returns data contents as string from S3 site-specific path
 * @param {*} Bucket 
 * @param {*} sitename 
 * @param {*} relativePath 
 * @returns 
 */
const getSiteFileContents = async (Bucket, sitename, relativePath, useCache = true) => {
  return new Promise(async (resolve, reject) => {

    let cachedSiteFileKey = siteFileCacheKey(relativePath);

    if (useCache) {
      let cachedSiteFile = appCache.get(cachedSiteFileKey);
      if (cachedSiteFile) {
        console.log(`[CACHE-HIT][Key=${cachedSiteFileKey}]`)
        return resolve(cachedSiteFile);
      }
    }

    let Key = `websites/${sitename}/${relativePath}`;
    let ContentType = 'application/json';
    console.log(`Getting s3://${Bucket}/${Key} with ContentType=${ContentType}`);
    const command = new GetObjectCommand({ Bucket, Key, ContentType });
    const response = await client.send(command);
    const readStream = response.Body;
    let dataStr = '';
    readStream.on('data', (d) => {
      dataStr+=d;
    });

    readStream.on('close', () => {
      appCache.set(cachedSiteFileKey, dataStr);
      resolve(dataStr);
    })

    readStream.on('error', (err) => {
      console.log('there was an error reading posts from s3: ');
      console.log(err);
      reject(err);
    })
  })
}

/**
 * Returns a list of image urls for a post
 * @param {*} Bucket 
 * @param {*} category 
 * @param {*} postId 
 */
const getImagesByPostId = async (Bucket, PostShortId) => {
  let Prefix = `posts/${PostShortId}`;

  const response = await client.send(new ListObjectsV2Command({ Bucket, Prefix }));
  let contents = Object.keys(response.Contents || {}).length === 0 ? [] : response.Contents;
  let images = [];

  for (let content of contents) {
    
    if (content.Key.endsWith("/"))
      continue;
    
    images.push(
      {
        Key: content.Key.split("/")[content.Key.split("/").length-1],
        Url: `https://${Bucket}.s3.${REGION}.amazonaws.com/${content.Key}`
      }
    )
  }

  return images;
}

const getSiteConfig = async () => {
  if (process.env.MOCK_DATA) {
    return fakeSiteConfig();
  }

  const configStr = await getSiteFileContents(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3, SITE_CONFIG_FILE_NAME);
  return JSON.parse(configStr);
}

const saveSiteConfig = async (siteConfigJson) => {
  let response = await uploadObjectToS3(
    process.env.STATIC_FILES_S3_BUCKET,
    `websites/${process.env.SITE_FOLDER_S3}/${SITE_CONFIG_FILE_NAME}`,
    JSON.stringify(siteConfigJson, null, 2)
  );
  return response;
}

const saveUsers = async (usersJson) => {
  let response = await uploadObjectToS3(
    process.env.STATIC_FILES_S3_BUCKET,
    `websites/${process.env.SITE_FOLDER_S3}/users/users.json`,
    JSON.stringify(usersJson, null, 2)
  );
  return response;
}

/**
 * Site users are those who contribute to or manage the site
 * @returns 
 */
const getSiteUsers = async () => {
  const configStr = await getSiteFileContents(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3, `users/users.json`, false);
  return JSON.parse(configStr);
}

const deleteFileS3 = async (Bucket, PostShortId, fileName) => {
  const Key = `posts/${PostShortId}/${fileName}`;
  const command = new DeleteObjectCommand({ Bucket, Key });
  const response = await client.send(command);
  return response;
}

const uploadImgObjectToS3 = async (Bucket, Key, Body) => {
  const command = new PutObjectCommand({ Bucket, Key, Body, Tagging: "public=TRUE", ContentType: 'image/jpeg' });
  const response = await client.send(command);
  return response;
}

const uploadObjectToS3 = async (Bucket, Key, Body) => {
  const command = new PutObjectCommand({ Bucket, Key, Body });
  const response = await client.send(command);
  return response;
}

const uploadImage = async (Bucket, PostShortId, imageBuff, fileName) => {
  let objKey = `posts/${PostShortId}/${fileName}`
  let response = await uploadImgObjectToS3(Bucket, objKey, imageBuff);
  return response;
}

module.exports = { deleteFileS3, getSiteFileContents, getImagesByPostId, getSiteConfig, getSiteUsers, uploadImage, saveSiteConfig, saveUsers }
