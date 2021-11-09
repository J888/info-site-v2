import { Columns } from "react-bulma-components";
import React from "react";
import MainWrapper from "../components/mainWrapper";
import { getPostsS3 } from "../util/getPosts";
import { getSiteFile } from "../util/s3Util";
import LinkWrapper from "../components/linkWrapper";
import PostGrid from "../components/postGrid";

const AllPosts = ({ posts, siteConfig }) => {
  return (
    <MainWrapper pageTitle={`All post categories`} siteName={siteConfig?.site?.name} description={`A grid of all blog posts available on the website`}>
      <Columns>
        <Columns.Column size={1}></Columns.Column>
        <Columns.Column size={7} style={{width: '100%'}}>
          {/* {
            postCategories.map(category => {
              return <LinkWrapper href={`/posts/${category}`} wrapInAnchor={true}>
                {category}
              </LinkWrapper>
            })
          } */}

          <PostGrid posts={posts}/>
        </Columns.Column>
        <Columns.Column size={3}></Columns.Column>
      </Columns>
    </MainWrapper>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  const posts = await getPostsS3(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3);
  const siteConfig = await getSiteFile(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3, `siteConfig.json`);

  // const tag = params.tag;
  // const matchingPosts = posts.filter((post) => post.tags.includes(tag));

  return {
    props: {
      posts,
      siteConfig
    },
  };
}

export default AllPosts;
