const NodeCache = require( "node-cache" );
const DYNAMO_BLOG_POSTS_CACHE_KEY = `dynamo/blogPosts`;
const siteFileCacheKey = (s3Path) => `siteFiles/${s3Path}`;

module.exports = {
  appCache: new NodeCache(), // defaults to unlimited TTL - https://www.npmjs.com/package/node-cache
  siteFileCacheKey,
  DYNAMO_BLOG_POSTS_CACHE_KEY
}
