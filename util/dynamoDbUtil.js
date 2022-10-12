import { fakePosts } from "./fakeDataUtil";
import { appCache, DYNAMO_BLOG_POSTS_CACHE_KEY } from "./nodeCache";

const { unmarshall } = require("@aws-sdk/util-dynamodb");
const { DynamoDBClient, ScanCommand, UpdateItemCommand, PutItemCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const REGION = 'us-east-2';
const dynamoClient = new DynamoDBClient({ region: REGION });
const NUM_DYNAMO_RETRIES = 5;
const SLEEP_SECONDS_BEFORE_RETRY = 2;

// https://stackoverflow.com/a/39914235
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const getBlogPostsDynamoDb = async (TableName) => {
  return new Promise(async (resolve, reject) => {

    let cachedPosts = appCache.get(DYNAMO_BLOG_POSTS_CACHE_KEY);
    if (appCache.get(DYNAMO_BLOG_POSTS_CACHE_KEY)) {
      console.log(`[CACHE-HIT][Key=${DYNAMO_BLOG_POSTS_CACHE_KEY}]`)
      return resolve(cachedPosts);
    }

    let retriesCount = 0;
    while (retriesCount < NUM_DYNAMO_RETRIES) {
      try {

        console.log(`[Retry=${retriesCount}] Hitting Dynamo TableName=${TableName}`)
        const res = await dynamoClient.send(new ScanCommand({
          TableName,
          FilterExpression: "SiteName = :s",
          ExpressionAttributeValues: {
            ':s': {S: process.env.SITE_IDENTIFIER},
          },
          // KeyConditionExpression: 'SiteName = :s',
        }));
  
        const items = res?.Items;
        let itemsUnmarshalled = items.map(item => unmarshall(item))
  
        itemsUnmarshalled.sort((a,b) => {
          if (new Date(a.CreatedAt) < new Date(b.CreatedAt)) {
            return 1;
          }
      
          if (new Date(a.CreatedAt) > new Date(b.CreatedAt)) {
            return -1;
          }
      
          return 0;
        })
        
        console.log(`Got ${itemsUnmarshalled.length} itemsUnmarshalled.\nCaching them in appCache`);
        appCache.set(DYNAMO_BLOG_POSTS_CACHE_KEY, itemsUnmarshalled);
        return resolve(itemsUnmarshalled);
  
      } catch (err) {
        console.log(err)
        if (err.name.includes(`ProvisionedThroughputExceededException`)) {
          retriesCount+=1;
          console.log(`Sleeping ${SLEEP_SECONDS_BEFORE_RETRY} seconds before retry`);
          await sleep(SLEEP_SECONDS_BEFORE_RETRY * 1000);
        }
      }

      console.log(`${NUM_DYNAMO_RETRIES} retries exceeded for getting posts from dynamo db`)
      return reject(`${NUM_DYNAMO_RETRIES} retries exceeded for getting posts from dynamo db`)
    }
  })
}

const getBlogPostsWithPrevNext = async (TableName) => {

  if (process.env.MOCK_DATA && process.env.MOCK_DATA_POST_COUNT) {
    return fakePosts();
  }

  let posts = await getBlogPostsDynamoDb(TableName)
  posts = posts.filter(p => !p.IsDraft);

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
       + `, #authorName = :authorNameVal`
       + `, #cat = :catVal`


      const params = {
        TableName,
        Key: {
          'SiteName': {
            S: process.env.SITE_IDENTIFIER
          },
          'PostId': {
            S: post.PostId
          },
        },
        UpdateExpression,
        ExpressionAttributeNames: {
          '#cat': 'Category',
          '#authorName': 'AuthorName',
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
          ':catVal': { S: post.Category },
          ':authorNameVal': { S: post.AuthorName },
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
          'SiteName' : {
            S: process.env.SITE_IDENTIFIER
          },
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
