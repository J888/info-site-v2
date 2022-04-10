import styles from "../sass/components/PostGrid.module.scss";
import PostGridItemV2 from "./postGridItemV2";
import React from "react";
import { PostData } from "../interfaces/PostData";

type Props = {
  heading?: string;
  posts: Array<PostData>;
  subHeading?: string;
};

const PostGrid = ({ posts, heading, subHeading }: Props) => (
  <React.Fragment>
    {heading && <h2 className={styles.heading}>{heading}</h2>}
    {subHeading && <p>{subHeading}</p>}
    <div className={styles.postGrid}>
    {posts.map((post) => (
      <PostGridItemV2
        description={post.Description}
        link={`/posts/${post.Category}/${post.PostId}`}
        imageUrl={post.ImageS3Url}
        tags={post.Tags?.slice(0,4).filter(t => t.length <= 17)}
        title={post.Title}
        category={post.Category?.charAt(0).toUpperCase() + post.Category?.slice(1)}
        createdAt={post.CreatedAt}
        key={post.PostId}
      />
    ))}
  </div>
  </React.Fragment>
  
);

export default PostGrid;
