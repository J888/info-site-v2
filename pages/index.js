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

export default function Home({ posts, topTags, mostVisited, siteConfig }) {
  const [visiblePosts, setVisiblePosts] = useState(posts.slice(0, 5));

  return (
    <MainWrapper pageTitle="Home" siteName={siteConfig?.site?.name}>
      <div style={{ paddingBottom: '10vw' }}>
        <Billboard
          title={'Gaze into the eyes of your next NFT'}
          body={'Here you’ll find all sorts of non fungible tokens.'}
        />
      </div>
      <PostGrid posts={visiblePosts}/>

      <div className={styles.seeAllLink}>
        <Link href="/posts" passHref>
          <a>{'See all posts →'}</a>
        </Link>
      </div>

      <Columns>
        <Columns.Column size={1}></Columns.Column>
        <Columns.Column size={7}>
          <Container>
            {/* <Heading>Posts</Heading> */}
          </Container>
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

          {visiblePosts.length >= posts.length && (
            <Box>You're all caught up!</Box>
          )}
        </Columns.Column>
        <Columns.Column size={3}>
          <Card>
            <Message>
              <Message.Header>Most Visited This Month</Message.Header>
            </Message>
            {mostVisited?.length > 0 && (
              <React.Fragment>
                <Card.Content>
                  Fishing Boat Spills Fuel In Bodega Bay (PHOTOS)
                </Card.Content>

                <Card.Content>
                  ICYMI: 'We Just Need To See You Again': LI Mom Searc...
                </Card.Content>

                <Card.Content>
                  Connecticut Will Take In Over 300 Afghan Refugees: L...
                </Card.Content>
              </React.Fragment>
            )}

            {mostVisited == undefined && (
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
      siteConfig
    },
  };
}
