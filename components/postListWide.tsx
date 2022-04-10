import React from "react";
import { Block, Card, Heading } from "react-bulma-components";
import { PostData } from "../interfaces/PostData";
import LinkWrapper from "./linkWrapper";

type Props = {
  heading: string;
  posts?: Array<PostData>;
};

const PostListWide = ({ posts, heading }: Props) => {
  return (
    <React.Fragment>
      <Heading>{heading}</Heading>
      {posts &&
        posts.map((post) => (
          <Block key={post.PostId}>
            <LinkWrapper href={`/posts/${post.Category}/${post.PostId}`} wrapInAnchor={true}>
              <Card>
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
