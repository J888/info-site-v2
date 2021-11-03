import Link from "next/link";
import React from "react";
import { Block, Card, Heading } from "react-bulma-components";
import LinkWrapper from "./linkWrapper";

const PostListWide = ({ posts, heading }) => {
  return (
    <React.Fragment>
      <Heading>{heading}</Heading>
      {posts &&
        posts.map((post) => (
          <Block key={post.id}>
            <LinkWrapper href={`/posts/${post.category}/${post.id}`} wrapInAnchor={true}>
              <Card clickable>
                <Card.Header.Title>{post.title}</Card.Header.Title>
                <Card.Content>{post.description}</Card.Content>
                <Card.Footer style={{ padding: "0.5em" }}>
                  {post.createdAt}
                </Card.Footer>
              </Card>
            </LinkWrapper>
          </Block>
        ))}
    </React.Fragment>
  );
};

export default PostListWide;
