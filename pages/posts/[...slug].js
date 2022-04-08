import MainWrapper from "../../components/mainWrapper";
import { Block } from "react-bulma-components";
import React from "react";
import { getSiteConfig } from "../../util/s3Util";
import useSWR from "swr";
import { getBlogPostsWithPrevNext } from "../../util/dynamoDbUtil";
import ImagePostGrid from "../../components/imagePostGrid";
import PostContent from "../../components/postContent";
import { firstWordsWithEllipses } from "../../util/textUtil";
import { DiscussionEmbed } from "disqus-react";
import { API_ENDPOINTS } from "../../lib/constants";

const Post = ({
  postData,
  postsByCategory,
  category,
  siteName,
  twitterUsername,
  slug,
  navLinks,
  navLogoUrl,
  navBackground,
  footerTagline,
  articleUrl,
  disqusShortname,
}) => {
  const { data: pageViewData, error } = useSWR(
    `${API_ENDPOINTS.PAGE_VIEWS}?slug=${encodeURIComponent(slug)}`,
    async (url) => {
      const res = await fetch(url);
      return res.json();
    }
  );

  let capitalizedCategory =
    category?.substring(0, 1)?.toUpperCase() + category?.substring(1);
  let pageTitle =
    postData?.Title !== undefined
      ? postData?.Title
      : `${capitalizedCategory} posts - ${postsByCategory?.length} results`;

  return (
    <MainWrapper
      twitterUsername={twitterUsername}
      pageTitle={pageTitle}
      siteName={siteName}
      description={postData?.Description}
      imageUrl={postData?.ImageS3Url}
      navLinks={navLinks}
      navLogoUrl={navLogoUrl}
      navBackground={navBackground}
      footerTagline={footerTagline}
    >
      {postData && (
        <PostContent
          data={postData}
          views={pageViewData?.views}
          twitterUsername={twitterUsername}
        />
      )}
      {postsByCategory && (
        <ImagePostGrid
          posts={postsByCategory}
          heading={`${postsByCategory.length} '${capitalizedCategory}' posts`}
        />
      )}
      <Block></Block>
      {articleUrl && (
        <DiscussionEmbed
          shortname={disqusShortname}
          config={{
            url: articleUrl,
            identifier: slug,
            title: pageTitle,
            language: "en_US",
          }}
        />
      )}
    </MainWrapper>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  const postsDynamo = await getBlogPostsWithPrevNext(
    process.env.BLOG_POSTS_DYNAMO_TABLE_NAME
  );
  const [category, id] = params.slug;
  const postData = postsDynamo.filter((post) => post.PostId == id)[0];
  const siteConfig = await getSiteConfig();
  const siteName = siteConfig.site.name;
  const twitterUsername = siteConfig.socialMedia.username.twitter;
  const navLinks = siteConfig.nav.links;
  const navLogoUrl = siteConfig.nav.logoUrl;
  const navBackground = siteConfig.nav.background;
  const footerTagline = siteConfig.footer.tagline;

  let postsByCategory = postsDynamo
    .filter((post) => post.Category == category)
    // trim down posts to only what is needed for the 'all posts in category' page
    .map((post) => ({
      ImageS3Url: post.ImageS3Url,
      Title: firstWordsWithEllipses(post.Title, 12),
      PostId: post.PostId,
      Category: post.Category,
    }));

  let baseProps = {
    siteName,
    twitterUsername,
    navLinks,
    navLogoUrl,
    navBackground,
    footerTagline,
  };

  // This is the case when only a category is given
  // e.g. /posts/{category}/
  if (category && !id) {
    return {
      props: {
        postsByCategory,
        category,
        ...baseProps,
      },
    };
  }

  // Otherwise, the post id is expected to be given.
  // e.g. /posts/{category}/{PostId}
  let slug = `/posts/${params.slug[0]}/${params.slug[1]}`;
  return {
    props: {
      slug,
      postData,
      disqusShortname: process.env.DISQUS_SHORTNAME,
      articleUrl: `${process.env.SITE_BASE_URL}${slug}`,
      ...baseProps,
    },
  };
}

export async function getStaticPaths() {
  const postsDynamo = await getBlogPostsWithPrevNext(
    process.env.BLOG_POSTS_DYNAMO_TABLE_NAME
  );

  return {
    paths:
      postsDynamo.map((post) => `/posts/${post.Category}/${post.PostId}`) || [],
    fallback: true,
  };
}

export default Post;
