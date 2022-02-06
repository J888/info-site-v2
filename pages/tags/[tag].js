import MainWrapper from "../../components/mainWrapper";
import React from "react";
import { getSiteConfig } from "../../util/s3Util";
import { getBlogPostsWithPrevNext } from "../../util/dynamoDbUtil";
import ImagePostGrid from "../../components/imagePostGrid";

const PostsByTag = ({ matchingPosts, tag, siteName, twitterUsername, navLinks, navLogoUrl, navBackground, footerTagline }) => {
  return (
    <MainWrapper
      twitterUsername={twitterUsername}
      pageTitle={`#${tag} posts - ${matchingPosts?.length} results`}
      siteName={siteName}
      description={`All posts tagged with "${tag}"`}
      navLinks={navLinks}
      navLogoUrl={navLogoUrl}
      navBackground={navBackground}
      footerTagline={footerTagline}
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
  const siteName = siteConfig.site.name;
  const twitterUsername = siteConfig.socialMedia.username.twitter;
  const navLinks = siteConfig.nav.links;
  const navLogoUrl = siteConfig.nav.logoUrl;
  const navBackground = siteConfig.nav.background;
  const footerTagline = siteConfig.footer.tagline;

  return {
    props: {
      tag,
      matchingPosts,
      siteName,
      twitterUsername,
      navLinks,
      navLogoUrl,
      navBackground,
      footerTagline
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
