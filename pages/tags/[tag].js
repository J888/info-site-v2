import MainWrapper from "../../components/mainWrapper";
import { Columns } from "react-bulma-components";
import React from "react";
import PostListWide from "../../components/postListWide";
import { getSiteFile } from "../../util/s3Util";
import { getBlogPostsWithPrevNext } from "../../util/dynamoDbUtil";

const PostsByTag = ({ matchingPosts, tag, siteConfig }) => {
  return (
    <MainWrapper pageTitle={`#${tag} posts`} siteName={siteConfig?.site?.name} description={`All posts that are tagged with "${tag}"`}>
      <Columns>
        <Columns.Column size={1}></Columns.Column>
        <Columns.Column size={7}>
          <PostListWide
            posts={matchingPosts}
            heading={`${matchingPosts?.length} Post${matchingPosts?.length > 1 ? 's' : ''} Tagged with #${tag}`}
          />
        </Columns.Column>
        <Columns.Column size={3}></Columns.Column>
      </Columns>
    </MainWrapper>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  const postsDynamo = await getBlogPostsWithPrevNext(process.env.BLOG_POSTS_DYNAMO_TABLE_NAME);

  const tag = params.tag;
  const matchingPosts = postsDynamo.filter((post) => post.Tags.includes(tag));
  const siteConfig = await getSiteFile(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3, `siteConfig.json`);

  return {
    props: {
      tag,
      matchingPosts,
      siteConfig
    },
  };
}

export async function getStaticPaths() {
  const postsDynamo = await getBlogPostsWithPrevNext(process.env.BLOG_POSTS_DYNAMO_TABLE_NAME);

  const tags = Array.from(new Set(postsDynamo.map((post) => post.Tags || []).flat()));

  return {
    paths: tags.map((tag) => `/tags/${tag}`) || [],
    fallback: true,
  };
}

export default PostsByTag;
