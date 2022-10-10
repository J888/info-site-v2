const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs').promises;

module.exports = async (phase) => {
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  // when `next build` or `npm run build` is used
  const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1';
  
  // pulls the static site configuration into the local fs for reading
  await exec(`aws s3 cp s3://${process.env.STATIC_FILES_S3_BUCKET}/websites/${process.env.SITE_FOLDER_S3} tmp  --recursive `);
  const siteConfigRaw = await fs.readFile("tmp/siteConfig.json", `utf-8`);
  const siteConfig = JSON.parse(siteConfigRaw);

  const env = {
    GOOGLE_ANALYTICS_ENABLED: siteConfig?.integrations?.google?.analytics?.enabled === true,
    GOOGLE_ANALYTICS_VIEW_ID: siteConfig?.integrations?.google?.analytics?.viewId,
    GOOGLE_ANALYTICS_PROPERTY_ID: siteConfig?.integrations?.google?.analytics?.propertyId,
    GOOGLE_CLIENT_EMAIL: siteConfig?.integrations?.google?.analytics?.clientEmail,
    GOOGLE_CLIENT_ID: siteConfig?.integrations?.google?.analytics?.clientId,
    BLOG_POSTS_DYNAMO_TABLE_NAME: process.env.BLOG_POSTS_DYNAMO_TABLE_NAME
  }

  /**
   * The domains that are allowed when using next/image
   */
  const images = {
    domains: [
      `${process.env.IMG_S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`,
      'images.squarespace-cdn.com'
    ],
  }

  return {
    env,
    images,
  }
}
