import React, { useState } from "react";
import { Button, Card } from "react-bulma-components";
import { PostData } from "../interfaces/PostData";
import { SaveState } from "../interfaces/SaveState";
import styles from "../sass/components/ScrollablePosts.module.scss";

type Props = {
  activeBlogPostIndex: number;
  deletePostHandler: (i: number) => void;
  fetchImagesHandler: (PostShortId: string) => void;
  posts: Array<PostData>;
  setActiveBlogPostIndex: (i: number) => void;
  setBlogPosts: (newPosts: Array<PostData>) => void;
  setCurrentSaveState: (state: SaveState) => void;
  setShowImagesIndex: (i: number) => void;
  showImagesIndex: number;
};

const ScrollablePosts = ({
  posts,
  setBlogPosts,
  activeBlogPostIndex,
  setActiveBlogPostIndex,
  setCurrentSaveState,
  deletePostHandler,
  fetchImagesHandler,
  setShowImagesIndex,
  showImagesIndex,
}: Props) => {
  const [infoShownPostIndexes, setInfoShownPostIndexes] = useState([]); // controls which posts to show info of

  return (
    <div className={styles.container}>
      {posts.map((post, i) => (
        <Card
          className={
            post.IsDraft ? styles["postCard--grayedOut"] : styles.postCard
          }
          key={post.PostId}
        >
          <Card.Header className={styles.postCardHeader}>
            <div className={styles.postCardHeaderTitleContainer}>
              <span
                className={styles.expandPostArrow}
                onClick={() => {
                  let infoShownPostIndexesNew = [...infoShownPostIndexes];
                  if (infoShownPostIndexesNew.includes(i)) {
                    let index = infoShownPostIndexesNew.indexOf(i);
                    infoShownPostIndexesNew.splice(index, 1); // index, num to delete
                  } else {
                    infoShownPostIndexesNew.push(i);
                  }
                  setInfoShownPostIndexes(infoShownPostIndexesNew);
                }}
              >
                {infoShownPostIndexes.includes(i) ? "v" : ">"}
              </span>

              <Card.Header.Title className={styles.postCardTitle}>
                {i + 1}. {post.Title} {post.IsDraft ? "[DRAFT]" : ""}
              </Card.Header.Title>
            </div>

            <div className={styles.postCardButtons}>
              <Button
                className={styles.postCardDeleteButton}
                color="danger"
                onClick={() => {
                  if (post.IsNewPost === true) {
                    // then this post hasn't been saved to dynamo yet
                    // so we can just remove it from here
                    let newPosts = [...posts];
                    newPosts.splice(i, 1); // index, num to delete
                    setBlogPosts(newPosts);

                    setActiveBlogPostIndex(0);
                  } else {
                    let deleteConfirmed = confirm(
                      "Are you sure you want to delete this post?"
                    );
                    if (deleteConfirmed === true) {
                      deletePostHandler(i);

                      // when switching posts, set the save state back to none
                      setCurrentSaveState(SaveState.NONE);
                    }
                  }
                }}
              >
                <img src="/icons/trash-24px.png" alt={"Trash icon"} />{" "}
              </Button>

              <Button
                className={styles.postCardImagesButton}
                color={showImagesIndex == i ? "dark" : ""}
                onClick={() => {
                  setActiveBlogPostIndex(i);
                  fetchImagesHandler(post.PostShortId);
                  setShowImagesIndex(i);
                }}
              >
                Images
              </Button>

              <Button
                className={styles.postCardEditButton}
                color=""
                onClick={() => {
                  setActiveBlogPostIndex(i);
                  setShowImagesIndex(undefined);

                  // when switching posts, set the save state back to none
                  setCurrentSaveState(SaveState.NONE);
                }}
              >
                <span>Edit</span>

                <span
                  className={
                    activeBlogPostIndex === i
                      ? styles.greenDotPostCardIndicator
                      : styles["greenDotPostCardIndicator--invisible"]
                  }
                ></span>
              </Button>
            </div>
          </Card.Header>
          {infoShownPostIndexes.includes(i) && (
            <Card.Content>
              <pre>{JSON.stringify(post, null, 2)}</pre>
            </Card.Content>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ScrollablePosts;
