import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Columns, Section } from "react-bulma-components";
import shortUUID from "short-uuid";
import styles from "../sass/components/Publish.module.scss";
const ADD_CONTENT = "Add content. . .";
import BlogPostEditor from "../components/blogPostEditor";
import ImageUploadEditor from "../components/imageUploadEditor";
import ScrollablePosts from "../components/scrollablePosts";
import { API_ENDPOINTS } from "../lib/constants";
import { SaveState } from "../interfaces/SaveState";
import ConfigurationPagesWrapper from "../components/configuration/ConfigurationPagesWrapper";

const newPost = (postNum) => ({
  PostId: `post-${postNum}-id`,
  PostShortId: shortUUID.generate(),
  Category: "category-here",
  Description: "",
  ImageS3Url: "",
  ImageKey: "",
  Title: `Untitled ${postNum}`,
  SubTitle: `Untitled ${postNum}`,
  CreatedAt: new Date().toLocaleString(),
  Parts: [
    {
      Type: "MARKDOWN",
      Contents: ADD_CONTENT,
    },
  ],
  Tags: ["add", "tags", "here"],
  IsNewPost: true,
  IsDraft: true,
});

const Publish = ({}) => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [imagesByPostShortId, setImagesByPostShortId] = useState({});
  const [activeBlogPostIndex, setActiveBlogPostIndex] = useState(0);
  const [editedPostIndexes, setEditedPostIndexes] = useState([]);
  const [currentSaveState, setCurrentSaveState] = useState(SaveState.NONE);
  // Controls what post to show images for, if any
  const [showImagesIndex, setShowImagesIndex] = useState(undefined);
  const showImagesBlogPost =
    showImagesIndex != undefined ? blogPosts[showImagesIndex] : null;

  useEffect(() => {
    if (blogPosts.length == 0) {
      getBlogPosts();
    }
  }, [blogPosts.length]);

  const getBlogPosts = async () => {
    const res = await axios.get(API_ENDPOINTS.ALL_POSTS);
    const { items } = res.data;
    setBlogPosts(items);
  };

  const fetchImagesHandler = async (PostShortId) => {
    const res = await axios.get(
      `${API_ENDPOINTS.ALL_POST_IMAGES}?PostShortId=${PostShortId}`
    );
    const { items } = res.data;

    let newImagesByPostShortId = {};
    Object.assign(newImagesByPostShortId, imagesByPostShortId);
    newImagesByPostShortId[PostShortId] = items;
    setImagesByPostShortId(newImagesByPostShortId);
  };

  const updatePostHandler = (atIndex, newValue) => {
    const newPosts = [...blogPosts];
    newPosts[atIndex] = newValue;
    setBlogPosts(newPosts);

    let newEditedPostIndexes = [...editedPostIndexes];
    newEditedPostIndexes.push(atIndex);
    setEditedPostIndexes(newEditedPostIndexes);
  };

  const savePostHandler = async (postId) => {
    let blogPostData = blogPosts.find((post) => post.PostId === postId);

    if (!blogPostData.IsNewPost) {
      const res = await axios.put(API_ENDPOINTS.UPDATE_POSTS, {
        posts: [blogPostData],
      });

      const { updateStatusCodes } = res?.data;
      console.log(`[PUT] saving PostId: ${postId}`);
      console.log(`Status codes were [${updateStatusCodes.join(", ")}]`);

      if (updateStatusCodes.includes(200)) {
        setCurrentSaveState(SaveState.SUCCESS);
      } else {
        setCurrentSaveState(SaveState.FAIL);
      }
    } else {
      delete blogPostData.IsNewPost;
      const res = await axios.post(API_ENDPOINTS.CREATE_POSTS, {
        posts: [blogPostData],
      });

      const { updateStatusCodes } = res?.data;
      console.log(`[POST] saving PostId: ${postId}`);
      console.log(`Status codes were [${updateStatusCodes.join(", ")}]`);

      if (updateStatusCodes.includes(200)) {
        setCurrentSaveState(SaveState.SUCCESS);
      } else {
        setCurrentSaveState(SaveState.FAIL);
      }
    }
  };

  const deletePostHandler = async (index) => {
    let blogPostData = blogPosts[index];
    const res = await axios.post(API_ENDPOINTS.DELETE_POSTS, {
      posts: [blogPostData],
    });
    const { updateStatusCodes } = res?.data;
    console.log(`[POST] for delete, PostId: ${blogPostData.PostId}`);
    console.log(`Status codes were [${updateStatusCodes.join(", ")}]`);

    let newPosts = [...blogPosts];
    newPosts.splice(index, 1); // index, num to delete
    setBlogPosts(newPosts);

    setActiveBlogPostIndex(0);
  };

  const isDraftChangeHandler = (index) => {
    let newPosts = [...blogPosts];
    newPosts[index].IsDraft = !newPosts[index].IsDraft;
    setBlogPosts(newPosts);
  };

  return (
    <Columns>
      <Columns.Column size={3}>
        <h1 className={styles.postsHeader}>Posts</h1>
        <Button
          className={styles.newPostButton}
          onClick={() => {
            let newBlogPosts = [...blogPosts];
            newBlogPosts.unshift(newPost(newBlogPosts.length + 1));
            setBlogPosts(newBlogPosts);
            setActiveBlogPostIndex(0);
          }}
        >
          New Post
        </Button>

        <ScrollablePosts
          posts={blogPosts}
          setBlogPosts={setBlogPosts}
          activeBlogPostIndex={activeBlogPostIndex}
          setActiveBlogPostIndex={setActiveBlogPostIndex}
          setCurrentSaveState={setCurrentSaveState}
          deletePostHandler={deletePostHandler}
          fetchImagesHandler={fetchImagesHandler}
          setShowImagesIndex={setShowImagesIndex}
          showImagesIndex={showImagesIndex}
        />

        {/* TODO: Remove or repurpose: */}
        {/* <DeploymentControls /> */}
      </Columns.Column>
      <Columns.Column size={9}>
        {blogPosts.length > 0 && showImagesIndex === undefined && (
          <BlogPostEditor
            saveState={currentSaveState} // SUCCESS, FAIL, NONE
            isDraftChangeHandler={isDraftChangeHandler}
            isEdited={
              editedPostIndexes?.includes(activeBlogPostIndex) || false
            }
            images={
              imagesByPostShortId[
                blogPosts[activeBlogPostIndex].PostShortId
              ]
            }
            postIndex={activeBlogPostIndex}
            initialData={blogPosts[activeBlogPostIndex]}
            updatePostHandler={updatePostHandler}
            savePostHandler={savePostHandler}
          />
        )}

        {showImagesIndex !== undefined && (
          <Section>
            <ImageUploadEditor
              images={imagesByPostShortId[showImagesBlogPost?.PostShortId]}
              postShortId={showImagesBlogPost?.PostShortId}
              title={showImagesBlogPost?.Title}
              fetchImagesHandler={fetchImagesHandler}
            />
          </Section>
        )}
      </Columns.Column>
    </Columns>
  );
};

const PublishWrapped = () => (
  <ConfigurationPagesWrapper activePage={"publish"}>
    <Publish />
  </ConfigurationPagesWrapper>
);

export async function getStaticProps({ params, preview = false, previewData }) {
  return {
    props: {},
  };
}

export default PublishWrapped;
