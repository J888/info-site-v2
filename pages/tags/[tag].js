import MainWrapper from "../../components/mainWrapper";
import { Columns } from "react-bulma-components";
import React from "react";
import PostListWide from "../../components/postListWide";
import { getSiteConfig } from "../../util/s3Util";
import { getBlogPostsWithPrevNext } from "../../util/dynamoDbUtil";

const PostsByTag = ({ matchingPosts, tag, siteName, twitterUsername }) => {
  return (
    <MainWrapper
      twitterUsername={twitterUsername}
      pageTitle={`#${tag} posts`}
      siteName={siteName}
      description={`All posts that are tagged with "${tag}"`}
    >
      <Columns>
        <Columns.Column size={1}></Columns.Column>
        <Columns.Column size={7}>
          <PostListWide
            posts={matchingPosts}
            heading={`${matchingPosts?.length} Post${
              matchingPosts?.length > 1 ? "s" : ""
            } Tagged with #${tag}`}
          />
        </Columns.Column>
        <Columns.Column size={3}></Columns.Column>
      </Columns>
    </MainWrapper>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  const postsDynamo = await getBlogPostsWithPrevNext(
    process.env.BLOG_POSTS_DYNAMO_TABLE_NAME
  );

  const tag = params.tag;
  const matchingPosts = postsDynamo.filter((post) => post.Tags.includes(tag));
  const siteConfig = await getSiteConfig();
  const siteName = siteConfig.site.name;
  const twitterUsername = siteConfig.socialMedia.username.twitter;

  return {
    props: {
      tag,
      matchingPosts,
      siteName,
      twitterUsername,
    },
  };
}

export async function getStaticPaths() {
  const postsDynamo = await getBlogPostsWithPrevNext(
    process.env.BLOG_POSTS_DYNAMO_TABLE_NAME
  );

  const tags = Array.from(
    new Set(postsDynamo.map((post) => post.Tags || []).flat())
  );

  return {
    paths: tags.map((tag) => `/tags/${tag}`) || [],
    fallback: true,
  };
}

export default PostsByTag;
