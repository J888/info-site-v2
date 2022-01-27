import {
  Card,
  Columns,
  Message,
  Tag,
} from "react-bulma-components";
import MainWrapper from "../components/mainWrapper";
import Link from "next/link";
import React from "react";
import { getSiteConfig } from "../util/s3Util";
import LinkWrapper from "../components/linkWrapper";
import PostGrid from "../components/postGrid";
import styles from "../sass/components/Index.module.scss"
import { getPageViewsBySlug } from "../lib/google_analytics/pageViewRetrieval";
import { getBlogPostsWithPrevNext } from "../util/dynamoDbUtil";
import { capitalizeWord } from "../util/textUtil";
import ShowMoreToggle from "../components/showMoreToggle";
import PostGridItemV2 from "../components/postGridItemV2";
import FeaturedSection from "../components/featuredSection";

const isSameDate = (dateA, dateB) => {
  // month number (0 - 11)
  if (dateA.getMonth() !== dateB.getMonth()) {
    return false;
  }

  // day of month
  if (dateA.getDate() !== dateB.getDate()) {
    return false;
  }

  // full year, e.g. 2021
  if (dateA.getFullYear() !== dateB.getFullYear()) {
    return false;
  }

  return true;
};

const newPostHeadingWording = (postCreatedDate, category) => {
  return isSameDate(new Date(), new Date(postCreatedDate))
    ? `Just Posted in ${category}`
    : `New in ${category}`;
};

export default function Home({
  postsByCategory,
  newestPost,
  topTags,
  mostVisitedList,
  siteName,
  siteStatementsPurposeLong,
  siteStatementsPurposeShort,
  categoryDescriptions,
  twitterUsername,
  navLinks,
  featuredPosts,
  featuredSection
}) {
  return (
    <MainWrapper
      twitterUsername={twitterUsername}
      pageTitle={`Front Page, ${siteStatementsPurposeShort}`}
      siteName={siteName}
      description={`A blog dedicated to non-fungible tokens, the blockchain, news, and the meta-verse.`}
      navLinks={navLinks}
    >
      <Columns style={{ margin: "0 0.5rem 0 0.5rem" }}>
        <Columns.Column size={2}></Columns.Column>
        <Columns.Column size={4}>
          <ShowMoreToggle
            labelShow={`+ Read more`}
            labelHide={`- Hide/minimize`}
            title={siteStatementsPurposeShort}
            titleSize={4}
            className={styles.frontPageBillboard}
          >
            {siteStatementsPurposeLong}
          </ShowMoreToggle>
        </Columns.Column>
        <Columns.Column size={4}>
          <h2 className={styles.newestPostHeading}>
            {newPostHeadingWording(newestPost.CreatedAt, capitalizeWord(newestPost.Category))}
          </h2>
          <PostGridItemV2
            description={newestPost.Description}
            link={`/posts/${newestPost.Category}/${newestPost.PostId}`}
            imageUrl={newestPost.ImageS3Url}
            tags={newestPost.Tags?.slice(0, 4).filter((t) => t.length <= 17)}
            title={newestPost.Title}
            category={
              capitalizeWord(newestPost.Category)
            }
            createdAt={newestPost.CreatedAt}
            key={newestPost.PostId}
          ></PostGridItemV2>
        </Columns.Column>
        <Columns.Column size={2}></Columns.Column>
      </Columns>

      <Columns className={styles.featuredSectionContainer}>
        <Columns.Column size={2}></Columns.Column>
        <Columns.Column size={8}>
          <FeaturedSection posts={featuredPosts} titleText={featuredSection.titleText}/>
        </Columns.Column>
        <Columns.Column size={2}></Columns.Column>
      </Columns>

      <Columns>
        <Columns.Column size={2}></Columns.Column>
        <Columns.Column size={5}>
          <Card>
            <Message>
              <Message.Header className={styles.popularListHeaders}>Most Viewed This Month</Message.Header>
            </Message>
            {mostVisitedList?.length > 0 && (
              <div className={styles.mostVisitedCard}>
                {mostVisitedList.slice(0, 5).map((mostVisitedItem) => (
                  <Card.Content
                    key={mostVisitedItem.slug}
                    className={styles.mostVisitedCardItem}
                  >
                    <Link href={mostVisitedItem.slug}>
                      {mostVisitedItem.title}
                    </Link>
                  </Card.Content>
                ))}
              </div>
            )}

            {mostVisitedList?.length == 0 && (
              <React.Fragment>
                <Card.Content>No data</Card.Content>
              </React.Fragment>
            )}
          </Card>
        </Columns.Column>
        <Columns.Column size={3}>
          <Card>
            <Message>
              <Message.Header className={styles.popularListHeaders}>Popular Hashtags</Message.Header>
            </Message>

            <Card.Content>
              <Tag.Group>
                {topTags.map((tag) => (
                  <Tag clickable key={tag} className={styles.popularTags}>
                    <LinkWrapper wrapInAnchor={true} href={`/tags/${tag}`}>
                      #{tag}
                    </LinkWrapper>
                  </Tag>
                ))}
              </Tag.Group>
            </Card.Content>
          </Card>
        </Columns.Column>
        <Columns.Column size={2}></Columns.Column>
      </Columns>

      {Object.keys(categoryDescriptions).map((category) => (
        <Columns key={category}>
          <Columns.Column size={2}>
          </Columns.Column>

          <Columns.Column size={8}>
            <PostGrid posts={postsByCategory[category].slice(0, 8)} heading={capitalizeWord(category)} subHeading={categoryDescriptions[category]} />
            <div className={styles.seeAllLink}>
              <Link href={`/posts/${category}`} passHref>
                <a>
                  {`More in `}
                  <i>{capitalizeWord(category)}</i>
                  {` →`}
                </a>
              </Link>
            </div>
          </Columns.Column>

          <Columns.Column size={2}>
          </Columns.Column>
        </Columns>
        
      ))}

      <div className={styles.seeAllLink}>
        <Link href="/posts" passHref>
          <a>{"All Posts →"}</a>
        </Link>
      </div>
    </MainWrapper>
  );
}

export async function getStaticProps() {
  const postsDynamo = await getBlogPostsWithPrevNext(process.env.BLOG_POSTS_DYNAMO_TABLE_NAME);
  const siteConfig = await getSiteConfig();
  const pageViewsMappedBySlug = await getPageViewsBySlug("2021-11-25");

  /**
   * [
   *  {
   *    "slug": "/posts/abcdefg",
   *    "title": "Something"
   *  }
   * ]
   */
  let mostVisitedList = [];
  for (let slug in pageViewsMappedBySlug) {
    if (slug.includes("/posts/")) {
      let title = postsDynamo.filter(p => `/posts/${p.Category}/${p.PostId}` === slug)[0]?.Title

      if (title) { //  title could be undefined if the page id changes after google analytics already recorded it
        mostVisitedList.push({ slug, title })
      }
    }
  }

  let tagCountOccurence = {
    /* tag: # of occurences */
  };

  for (let post of postsDynamo) {
    for (let tag of post.Tags) {
      if (tagCountOccurence[tag] == undefined) {
        tagCountOccurence[tag] = 1;
      } else {
        tagCountOccurence[tag] += 1;
      }
    }
  }

  let topTags = Object.entries(tagCountOccurence)
    .sort((a, b) => {
      if (a[1] > b[1]) {
        return -1;
      }
      if (a[1] < b[1]) {
        return 1;
      }
      return 0;
    })
    .slice(0, 10);
  topTags = topTags.map((topTag) => topTag[0]);

  // Strip down the posts because we don't wanna pass too much (or any) data to props
  // that won't be used.
  let postsStrippedDown = postsDynamo.map((p) => {
    // Separate out the Parts array.. it's not needed for the front page.
    let {Parts, ...stripped} = p;
    return stripped;
  });

  // newest post to display at top of front page
  let newestPost = postsStrippedDown[0];

  let postsByCategory = {}
  for (let p of postsStrippedDown) {

    // if the post is the newest one, skip it since it's already displayed
    // at the top of the front page
    if (p.PostShortId === newestPost.PostShortId) {
      continue;
    }
    let cat = p.Category;
    if (postsByCategory[cat] === undefined) {
      postsByCategory[cat] = [p];
    } else {
      postsByCategory[cat].push(p)
    }
  }

  let { categoryDescriptions } = siteConfig;
  let siteStatementsPurposeLong = siteConfig.site.statements.purpose.long;
  let siteStatementsPurposeShort = siteConfig.site.statements.purpose.short;
  let twitterUsername = siteConfig.socialMedia.username.twitter;
  let siteName = siteConfig.site.name;
  const navLinks = siteConfig.nav.links;
  const featuredSection = siteConfig.featuredSection;
  const featuredPosts = postsStrippedDown.filter(p => featuredSection.postIds.includes(p.PostId))

  return {
    props: {
      postsByCategory,
      newestPost,
      topTags,
      siteName,
      siteStatementsPurposeLong,
      siteStatementsPurposeShort,
      categoryDescriptions,
      mostVisitedList,
      twitterUsername,
      navLinks,
      featuredPosts,
      featuredSection
    },
  };
}
