import React from "react";
import { getPostsS3 } from "../util/getPosts";

/**
 * Sitemap component for SEO / crawler optimization
 */
const SiteMap = () => {

}

export const getServerSideProps = async ({ res }) => {
  const posts = await getPostsS3(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3);
  const tags = Array.from(new Set(posts.map((post) => post.tags || []).flat()));

  const BASE_URL = "https://localhost.com"

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${BASE_URL}/posts</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
      </url>
      ${
        posts.map(post => {
          return `
            <url>
              <loc>${BASE_URL}/posts/${post.category}/${post.id}</loc>
              <lastmod>${new Date(post.createdAt).toISOString()}</lastmod>
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
