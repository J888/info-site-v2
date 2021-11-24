import React from "react";
import { getBlogPostsWithPrevNext } from "../util/dynamoDbUtil";

/**
 * Sitemap component for SEO / crawler optimization
 */
const SiteMap = () => {

}

export const getServerSideProps = async ({ res }) => {
  const postsDynamo = await getBlogPostsWithPrevNext(process.env.BLOG_POSTS_DYNAMO_TABLE_NAME);
  
  const tags = Array.from(new Set(postsDynamo.map((post) => post.Tags || []).flat()));

  const BASE_URL = "https://nftgazer.com"

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${BASE_URL}/posts</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
      </url>
      ${
        postsDynamo.map(post => {
          return `
            <url>
              <loc>${BASE_URL}/posts/${post.Category}/${post.PostId}</loc>
              <lastmod>${new Date(post.CreatedAt).toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.9</priority>
            </url>
          `;
        }).join("")
      }
      ${
        tags.map(tag => {
          return `
            <url>
              <loc>${BASE_URL}/tags/${tag}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>0.9</priority>
            </url>
          `;
        }).join("")
      }
    </urlset>
  `;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
