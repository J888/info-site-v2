const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3"); // CommonJS import
const REGION = 'us-east-2';
const client = new S3Client({ region: REGION });

const getSiteFile = async (Bucket, sitename, relativePath) => {
  return new Promise(async (resolve, reject) => {
    let Key = `websites/${sitename}/${relativePath}`;
    let ContentType = 'application/json';
    console.log(`Getting posts from s3 at path ${Key} with ContentType=${ContentType}`);
    const command = new GetObjectCommand({ Bucket, Key, ContentType });
    const response = await client.send(command);
    const readStream = response.Body;
    let dataStr = '';
    readStream.on('data', (d) => {
      dataStr+=d;
    });

    readStream.on('close', () => {
      resolve(JSON.parse(dataStr));
    })

    readStream.on('error', (err) => {
      console.log('there was an error reading posts from s3: ');
      console.log(err);
      reject(err);
    })
  })
}

export { getSiteFile }
