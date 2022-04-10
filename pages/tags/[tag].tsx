import MainWrapper from "../../components/mainWrapper";
import React from "react";
import { getSiteConfig } from "../../util/s3Util";
import { getBlogPostsWithPrevNext } from "../../util/dynamoDbUtil";
import ImagePostGrid from "../../components/imagePostGrid";
import { PostData } from "../../interfaces/PostData";
import { SiteConfig } from "../../interfaces/SiteConfig";

type Props = {
  matchingPosts: Array<PostData>;
  tag: string;
  siteConfig: SiteConfig;
};

const PostsByTag = ({
  matchingPosts,
  tag,
  siteConfig
}: Props) => {
  return (
    <MainWrapper
      title={`#${tag} posts - ${matchingPosts?.length} results`}
      description={`All posts tagged with "${tag}"`}
      siteConfig={siteConfig}
    >
      <ImagePostGrid
        posts={matchingPosts}
        heading={`${matchingPosts?.length} post${
          matchingPosts?.length > 1 ? "s" : ""
        } tagged #${tag}`}
      />
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

  return {
    props: {
      tag,
      matchingPosts,
      siteConfig
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
