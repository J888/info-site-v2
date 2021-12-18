import { Columns } from "react-bulma-components";
import React from "react";
import MainWrapper from "../components/mainWrapper";
import { getSiteFile } from "../util/s3Util";
import PostGrid from "../components/postGrid";
import { getBlogPostsWithPrevNext } from "../util/dynamoDbUtil";

const AllPosts = ({ postsDynamo, siteConfig }) => {
  return (
    <MainWrapper pageTitle={`All Posts, Read ${postsDynamo.length} Blog Posts About NFTs and More`} siteName={siteConfig?.site?.name} description={`A grid of all blog posts available on the website`}>
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

          <PostGrid posts={postsDynamo}/>
        </Columns.Column>
        <Columns.Column size={3}></Columns.Column>
      </Columns>
    </MainWrapper>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  const postsDynamo = await getBlogPostsWithPrevNext(process.env.BLOG_POSTS_DYNAMO_TABLE_NAME);

  const siteConfig = await getSiteFile(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3, `siteConfig.json`);

  // const tag = params.tag;
  // const matchingPosts = posts.filter((post) => post.tags.includes(tag));

  return {
    props: {
      postsDynamo,
      siteConfig
    },
  };
}

export default AllPosts;
