import {
  Card,
  Columns,
  Container,
  Message,
  Tag,
  Block,
} from "react-bulma-components";
import MainWrapper from "../components/mainWrapper";

import Link from "next/link";
import React, { useState } from "react";
import { getSiteFile } from "../util/s3Util";
import LinkWrapper from "../components/linkWrapper";
import Billboard from "../components/billboard";
import PostGrid from "../components/postGrid";
import styles from "../sass/components/Index.module.scss"
import { getPageViewsBySlug } from "../lib/google_analytics/pageViewRetrieval";
import { getBlogPostsWithPrevNext } from "../util/dynamoDbUtil";
import { capitalizeWord } from "../util/textUtil";
const siteMission = `Dive into NFTs, the Meta-Verse, Blockchain News, and More.`;
const contentDeliveryMission = `We aim to provide information in layman's terms so that anyone can grasp ideas no matter how complex.`;
const whereWeAreGoingStatement = `Follow along as we make sense of this revolutionary time in technology.`

export default function Home({ postsByCategory, postsDynamo, topTags, mostVisitedList, siteConfig }) {
  const [visiblePosts, setVisiblePosts] = useState(postsDynamo.slice(0, 8));
  return (
    <MainWrapper
      pageTitle={`Front Page, ${siteMission}`}
      siteName={siteConfig?.site?.name}
      description={`A blog dedicated to non-fungible tokens, the blockchain, news, and the meta-verse.`}
    >
      <div className={styles.homePageBillboard}>
        <Billboard
          title={siteMission}
          body={`${siteConfig?.site?.name} is a tiny blog started in 2021 to report on news in topics such as NFTs, crypto, and blockchain innovations. ${contentDeliveryMission} ${whereWeAreGoingStatement}`}
        />
      </div>

      {
        ['rarity', 'news', 'gaming', 'learn', 'nft', 'metaverse', 'music'].map(category => 
            <div>
              <Columns>
                <Columns.Column size={1}></Columns.Column>
                <Columns.Column size={7}>
                  <h2 className={styles.headingBeforePostGrid}>{capitalizeWord(category)}</h2>
                </Columns.Column>
                <Columns.Column size={3}></Columns.Column>
              </Columns>
              <PostGrid posts={postsByCategory[category]} />
              <div className={styles.seeAllLink}>
                <Link href={`/posts/${category}`} passHref>
                  <a>{`More `}<i>{capitalizeWord(category)}</i>{` →`}</a>
                </Link>
              </div>
            </div>
          )
      }

      <div className={styles.seeAllLink}>
        <Link href="/posts" passHref>
          <a>{"Posts From All Categories →"}</a>
        </Link>
      </div>

      <Columns>
        <Columns.Column size={1}></Columns.Column>
        <Columns.Column size={7}>
          <Container>{/* <Heading>Posts</Heading> */}</Container>
        </Columns.Column>
        <Columns.Column size={3}></Columns.Column>
      </Columns>

      <Columns>
        <Columns.Column size={1}></Columns.Column>
        <Columns.Column size={7}></Columns.Column>
        <Columns.Column size={3}>
          <Card>
            <Message>
              <Message.Header>Most Viewed This Month</Message.Header>
            </Message>
            {mostVisitedList?.length > 0 && (
              <div className={styles.mostVisitedCard}>
                {mostVisitedList.slice(0, 5).map((mostVisitedItem) => (
                  <Card.Content key={mostVisitedItem.slug} className={styles.mostVisitedCardItem}>
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

          <Block />
          <Card>
            <Message>
              <Message.Header>Popular Hashtags</Message.Header>
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
                {/* <Tag>#fall</Tag>
                <Tag>#pa</Tag>
                <Tag>#outdoors</Tag>
                <Tag>#hurricane</Tag>
                <Tag>#covid</Tag> */}
              </Tag.Group>
            </Card.Content>
          </Card>
        </Columns.Column>
      </Columns>
    </MainWrapper>
  );
}

export async function getStaticProps() {
  const postsDynamo = await getBlogPostsWithPrevNext(process.env.BLOG_POSTS_DYNAMO_TABLE_NAME);

  const siteConfig = await getSiteFile(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3, `siteConfig.json`);

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

  let postsByCategory = {}
  for (let p of postsDynamo) {
    let cat = p.Category;
    if (postsByCategory[cat] === undefined) {
      postsByCategory[cat] = [p];
    } else {
      postsByCategory[cat].push(p)
    }
  }

  return {
    props: {
      postsByCategory,
      postsDynamo,
      topTags,
      siteConfig,
      mostVisitedList
    },
  };
}
