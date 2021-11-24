const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { DynamoDBClient, ScanCommand, UpdateItemCommand, PutItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");

const REGION = 'us-east-2';
const dynamoClient = new DynamoDBClient({ region: REGION });

const getBlogPostsDynamoDb = async (TableName) => {
  return new Promise(async (resolve, reject) => {

    try {
      const res = await dynamoClient.send(new ScanCommand({
        TableName
      }));

      const items = res?.Items;

      resolve(items.map(item => unmarshall(item)));

    } catch (err) {
      reject(err);
    }

  })
}

const getBlogPostsWithPrevNext = async (TableName) => {
  const posts = await getBlogPostsDynamoDb(TableName);
  // Sort descending (latest posts first in list)
  posts.sort((a,b) => {
    if (new Date(a.CreatedAt) < new Date(b.CreatedAt)) {
      return 1;
    }

    if (new Date(a.CreatedAt) > new Date(b.CreatedAt)) {
      return -1;
    }

    return 0;
  })

  for (let i = 0; i < posts.length; i++) {
    let post = posts[i];
    let prevPost = i > 0 ? posts[i-1] : null;
    let nextPost = i < posts.length - 1  ? posts[i+1] : null;

    if (prevPost) {
      post.PrevPost = {
        Slug: `/posts/${prevPost.Category}/${prevPost.PostId}`,
        Title: prevPost.Title
      }
    }

    if (nextPost) {
      post.NextPost = {
        Slug: `/posts/${nextPost.Category}/${nextPost.PostId}`,
        Title: nextPost.Title
      }
    }
  }

  return posts;
}

const updateBlogPostsDynamoDb = async (TableName, posts) => {
  return new Promise(async (resolve, reject) => {

    let awsResStatusCodes = []
    for (let i = 0; i < posts.length; i++) {
      let post = posts[i];

      let UpdateExpression = `set #shortId = :shortIdVal, #imgS3Url = :imgS3UrlVal`
       + `, #imgKey = :imgKeyVal, #desc = :descVal`
       + `, #title = :titleVal, #stitle = :stitleVal`
       + `, #cr = :crVal`
       + `, #parts = :partsVal, #tags = :tagsVal, #isDr = :isDrVal`

      const params = {
        TableName,
        Key: {
          'Category': {
            S: post.Category
          },
          'PostId': {
            S: post.PostId
          },
        },
        UpdateExpression,
        ExpressionAttributeNames: { 
          '#shortId': 'PostShortId',
          '#imgS3Url': 'ImageS3Url',
          '#imgKey': 'ImageKey',
          '#desc': 'Description',
          '#title': 'Title',
          '#stitle': 'SubTitle',
          '#cr': 'CreatedAt',
          '#parts': 'Parts',
          '#tags': 'Tags',
          '#isDr': 'IsDraft'
        },
        ExpressionAttributeValues: { 
          ':shortIdVal': { S: post.PostShortId },
          ':imgS3UrlVal': { S: post.ImageS3Url },
          ':imgKeyVal': { S: post.ImageKey },
          ':descVal': { S: post.Description },
          ':titleVal': { S: post.Title },
          ':stitleVal': { S: post.SubTitle },
          ':crVal': { S: post.CreatedAt },
          ':partsVal': {
            L: post.Parts.map(part => ({
              M: {
                'Type': {
                  S: part.Type
                },
                'Contents': {
                  S: part.Contents
                }
              }
            }))
          },
          ':tagsVal': {
            L: post.Tags.map(tag => ({ S: tag }))
          },
          ':isDrVal': { BOOL: post.IsDraft }
        },
      };

      try {
        const res = await dynamoClient.send(new UpdateItemCommand(params));
        
        console.log(res['$metadata'].httpStatusCode)
        awsResStatusCodes.push(res['$metadata'].httpStatusCode);
  
      } catch (err) {
        reject(err);
      }

    }

    resolve(awsResStatusCodes)
  })
}

const createBlogPostsDynamoDb = async (TableName, posts) => {
  return new Promise(async (resolve, reject) => {

    let awsResStatusCodes = []
    for (let i = 0; i < posts.length; i++) {
      let post = posts[i];

      console.log(JSON.stringify(post, null, 2))

      const params = {
        TableName,
        Item: {
          'Category': {
            S: post.Category
          },
          'PostId': {
            S: post.PostId
          },
          'PostShortId': {
            S: post.PostShortId
          },
          'ImageS3Url': { S: post.ImageS3Url },
          'ImageKey': { S: post.ImageKey },
          'Description': { S: post.Description },
          'Title': { S: post.Title },
          'SubTitle': { S: post.SubTitle },
          'CreatedAt': { S: post.CreatedAt },
          'Parts': {
            L: post.Parts.map(part => ({
              M: {
                'Type': {
                  S: part.Type
                },
                'Contents': {
                  S: part.Contents
                }
              }
            }))
          },
          'Tags': {
            L: post.Tags.map(tag => ({ S: tag }))
          },
          'IsDraft': { BOOL: post.IsDraft }
        }
      };

      try {
        const res = await dynamoClient.send(new PutItemCommand(params));
        
        console.log(res['$metadata'].httpStatusCode)
        awsResStatusCodes.push(res['$metadata'].httpStatusCode);
  
      } catch (err) {
        reject(err);
      }

    }

    resolve(awsResStatusCodes)
  })
}

const deleteBlogPostsDynamoDb = async (TableName, posts) => {
  return new Promise(async (resolve, reject) => {

    let awsResStatusCodes = []
    for (let i = 0; i < posts.length; i++) {
      let post = posts[i];

      console.log(JSON.stringify(post, null, 2))

      const params = {
        TableName,
        Key: {
          'Category': {
            S: post.Category
          },
          'PostId': {
            S: post.PostId
          }
        }
      };

      try {
        const res = await dynamoClient.send(new DeleteItemCommand(params));
        
        console.log(res['$metadata'].httpStatusCode)
        awsResStatusCodes.push(res['$metadata'].httpStatusCode);
  
      } catch (err) {
        reject(err);
      }

    }

    resolve(awsResStatusCodes)
  })
}

export { getBlogPostsDynamoDb, createBlogPostsDynamoDb, deleteBlogPostsDynamoDb, updateBlogPostsDynamoDb, getBlogPostsWithPrevNext }
