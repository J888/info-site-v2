const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');

module.exports = (phase) => {
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  // when `next build` or `npm run build` is used
  const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1';
  
  const env = {
    POSTS_DIR: (() => {
      if (isDev) return process.env.LOCAL_POSTS_DIR;
      return 'tmp/posts';
    })(),
    GOOGLE_ANALYTICS_PROPERTY_ID: process.env.GOOGLE_ANALYTICS_PROPERTY_ID
  }

  /**
   * The domains that are allowed when using next/image
   */
  const images = {
    domains: [
      `${process.env.IMG_S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`,
      'images.squarespace-cdn.com',
      'nftgazer.com' // needed or else NEXT optimized images won't work
    ],
  }

  return {
    env,
    images
  }
}
