import {
  Button,
  Box,
  Card,
  Columns,
  Container,
  Message,
  Tag,
  Block,
  Hero,
} from "react-bulma-components";
import MainWrapper from "../components/mainWrapper";

import Link from "next/link";
import React, { useState } from "react";
import { getPostsS3 } from "../util/getPosts";
import { getSiteFile } from "../util/s3Util";
import LinkWrapper from "../components/linkWrapper";
import Billboard from "../components/billboard";
import PostGrid from "../components/postGrid";
import styles from "../sass/components/Index.module.scss"
import { getPageViewsBySlug } from "../lib/google_analytics/pageViewRetrieval";

export default function Home({ posts, topTags, mostVisitedList, siteConfig }) {
  const [visiblePosts, setVisiblePosts] = useState(posts.slice(0, 5));

  return (
    <MainWrapper
      pageTitle="Home"
      siteName={siteConfig?.site?.name}
      description={`The front page and home page of the website.`}
    >
      <div style={{ paddingBottom: "10vw" }}>
        <Billboard
          title={"Gaze into the eyes of your next NFT"}
          body={"Here you’ll find all sorts of non fungible tokens."}
        />
      </div>
      <PostGrid posts={visiblePosts} />

      <div className={styles.seeAllLink}>
        <Link href="/posts" passHref>
          <a>{"See all posts →"}</a>
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
        <Columns.Column size={7}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            {/* {visiblePosts.map((item, i) => (
              <LinkWrapper
                wrapInAnchor={true}
                href={`/posts/${item.category}/${item.id}`}
                key={`${item.category}/${item.id}`}
              >
                <div>
                  <Card
                    style={{ width: "18em", marginBottom: "1em" }}
                    display={""}
                    clickable
                  >
                    <Card.Image
                      size="1by4"
                      src={item.imageUrl}
                      style={{ objectFit: "cover" }}
                    />
                    <Card.Content>
                      <Media>
                        <Media.Item>
                          <Heading size={4}>{item.title}</Heading>
                          <Heading subtitle size={6}>
                            {item.subTitle}
                          </Heading>
                        </Media.Item>
                      </Media>
                      <Content>
                        {item.description}
                        <br />
                        <time dateTime="2016-1-1">{item.createdAt}</time>
                      </Content>
                    </Card.Content>
                  </Card>
                </div>
              </LinkWrapper>
            ))} */}
          </div>

      
        </Columns.Column>
        <Columns.Column size={3}>
          <Card>
            <Message>
              <Message.Header>Most Viewed This Month</Message.Header>
            </Message>
            {mostVisitedList?.length > 0 && (
              <div className={styles.mostVisitedCard}>
                {mostVisitedList.slice(0, 5).map((mostVisitedItem) => (
                  <Card.Content>
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
  const posts = await getPostsS3(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3);
  const siteConfig = await getSiteFile(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3, `siteConfig.json`);

  const pageViewsMappedBySlug = await getPageViewsBySlug("2021-11-08");

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
      console.log(`slugs is ${slug}`)
      let title = posts.filter(p => `/posts/${p.category}/${p.id}` === slug)[0]?.title

      if (title) { //  title could be undefined if the page id changes after google analytics already recorded it
        mostVisitedList.push({ slug, title })
      }
    }
  }

  console.log(JSON.stringify(mostVisitedList, null, 2))

  let tagCountOccurence = {
    /* tag: # of occurences */
  };

  for (let post of posts) {
    for (let tag of post.tags) {
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

  return {
    props: {
      posts,
      topTags,
      siteConfig,
      mostVisitedList
    },
  };
}
