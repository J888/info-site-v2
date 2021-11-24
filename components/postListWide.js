import React from "react";
import { Block, Card, Heading } from "react-bulma-components";
import LinkWrapper from "./linkWrapper";

const PostListWide = ({ posts, heading }) => {
  return (
    <React.Fragment>
      <Heading>{heading}</Heading>
      {posts &&
        posts.map((post) => (
          <Block key={post.PostId}>
            <LinkWrapper href={`/posts/${post.Category}/${post.PostId}`} wrapInAnchor={true}>
              <Card clickable>
                <Card.Header.Title>{post.Title}</Card.Header.Title>
                <Card.Content>{post.Description}</Card.Content>
                <Card.Footer style={{ padding: "0.5em" }}>
                  {post.CreatedAt}
                </Card.Footer>
              </Card>
            </LinkWrapper>
          </Block>
        ))}
    </React.Fragment>
  );
};

export default PostListWide;
