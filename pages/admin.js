import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Columns, Section } from "react-bulma-components";
import shortUUID from "short-uuid";
import styles from "../sass/components/Admin.module.scss"
const ADD_CONTENT = "Add content. . .";
import BlogPostEditor from "../components/blogPostEditor";
import LoginForm from "../components/loginForm";
import ImageUploadEditor from "../components/imageUploadEditor";
import DeploymentControls from "../components/deploymentControls";

const API_ENDPOINTS = {
  ALL_POST_IMAGES: `/api/posts/images`,
  ALL_POSTS: `/api/posts/all`,
  LOGIN: `/api/login`,
  USER: `/api/user`,
  CREATE_POSTS: `/api/posts/create/`,
  DELETE_POSTS: `/api/posts/delete`,
  UPDATE_POSTS: `/api/posts/update/`
}

const getCurrentUser = async () => {
  const res = await axios.get(API_ENDPOINTS.USER);
  return res?.data;
}

const Admin = ({}) => {
  const [loggedInAdmin, setLoggedInAdmin] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [imagesByPostShortId, setImagesByPostShortId] = useState({});
  const [activeBlogPostIndex, setActiveBlogPostIndex] = useState(0);
  const [editedPostIndexes, setEditedPostIndexes] = useState([]);
  const [infoShownPostIndexes, setInfoShownPostIndexes] = useState([]); // controls which posts to show info of
  const [currentSaveState, setCurrentSaveState] = useState('NONE');
  // Controls what post to show images for, if any
  const [showImagesIndex, setShowImagesIndex] = useState(undefined);
  const showImagesBlogPost = showImagesIndex != undefined ? blogPosts[showImagesIndex] : null;

  useEffect(() => {

    async function callGetCurrentUser() {
      let user = await getCurrentUser();
      if (user?.admin) {
        setLoggedInAdmin(true)
      }
    }

    if(!loggedInAdmin) {
      callGetCurrentUser();
    }

    if (blogPosts.length == 0) {
      getBlogPosts();
    }
  }, [loggedInAdmin, blogPosts.length]);

  const loginHandler = async (providedUsername, password) => {
    await axios.post(API_ENDPOINTS.LOGIN, {
      username: providedUsername,
      password,
    });

    const user = await getCurrentUser();

    setLoginFailed(!user || !user?.admin);
    setLoggedInAdmin(user && user.admin); 
  };

  const saveBlogPostClickHandler = async (parts) => {
    alert(`saving ${JSON.stringify(parts, null, 2)}`)
  }

  const getBlogPosts = async () => {
    const res = await axios.get(API_ENDPOINTS.ALL_POSTS);
    const { items } = res.data;
    setBlogPosts(items);
  }

  const fetchImagesHandler = async (PostShortId) => {
    const res = await axios.get(`${API_ENDPOINTS.ALL_POST_IMAGES}?PostShortId=${PostShortId}`);
    const { items } = res.data;

    let newImagesByPostShortId = {}
    Object.assign(newImagesByPostShortId, imagesByPostShortId);
    newImagesByPostShortId[PostShortId] = items;
    setImagesByPostShortId(newImagesByPostShortId);
  }

  const updatePostHandler = (atIndex, newValue) => {
    const newPosts = [...blogPosts]
    newPosts[atIndex] = newValue;
    setBlogPosts(newPosts);

    let newEditedPostIndexes = [...editedPostIndexes];
    newEditedPostIndexes.push(atIndex);
    setEditedPostIndexes(newEditedPostIndexes);
  }

  const savePostHandler = async (postId) => {

    let blogPostData = blogPosts.find(post => post.PostId === postId);

    if (!blogPostData.IsNewPost) {
      const res = await axios.put(API_ENDPOINTS.UPDATE_POSTS, { posts: [blogPostData] });

      const { updateStatusCodes } = res?.data;
      console.log(`[PUT] saving PostId: ${postId}`)
      console.log(`Status codes were [${updateStatusCodes.join(", ")}]`);

      if (updateStatusCodes.includes(200)) {
        setCurrentSaveState("SUCCESS");
      } else {
        setCurrentSaveState("FAIL");
      }
  
    } else {
      delete blogPostData.IsNewPost
      const res = await axios.post(API_ENDPOINTS.CREATE_POSTS, { posts: [blogPostData] });

      const { updateStatusCodes } = res?.data;
      console.log(`[POST] saving PostId: ${postId}`)
      console.log(`Status codes were [${updateStatusCodes.join(", ")}]`);

      if (updateStatusCodes.includes(200)) {
        setCurrentSaveState("SUCCESS");
      } else {
        setCurrentSaveState("FAIL");
      }

    }
  }

  const deletePostHandler = async (index) => {
    let blogPostData = blogPosts[index];
    const res = await axios.post(API_ENDPOINTS.DELETE_POSTS, { posts: [blogPostData] });
    const { updateStatusCodes } = res?.data;
    console.log(`[POST] for delete, PostId: ${blogPostData.PostId}`)
    console.log(`Status codes were [${updateStatusCodes.join(", ")}]`);

    let newPosts = [...blogPosts];
    newPosts.splice(index, 1); // index, num to delete
    setBlogPosts(newPosts);

    setActiveBlogPostIndex(0);
  }

  const isDraftChangeHandler = (index) => {
    let newPosts = [...blogPosts];
    newPosts[index].IsDraft = !newPosts[index].IsDraft;
    setBlogPosts(newPosts);
  }

  return (
    <div>
      {!loggedInAdmin && (
        <LoginForm loginHandler={loginHandler} />
      )}
      {loggedInAdmin && <div>Logged in!</div>}
      {loginFailed && <div>Login Failed </div>}

      {loggedInAdmin && (
        <Columns className={styles.mainWrapper}>
          <Columns.Column size={3}>
            <h1 className={styles.postsHeader}>Posts</h1>
            <Button
              className={styles.newPostButton}
              onClick={() => {
                let newBlogPosts = [...blogPosts];
                newBlogPosts.unshift({
                  PostId: `post-${newBlogPosts.length + 1}-id`,
                  PostShortId: shortUUID.generate(),
                  Category: "category-here",
                  Description: "",
                  ImageS3Url: "",
                  ImageKey: "",
                  Title: `Untitled ${newBlogPosts.length + 1}`,
                  SubTitle: `Untitled ${newBlogPosts.length + 1}`,
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

                setBlogPosts(newBlogPosts);
                setActiveBlogPostIndex(0);
              }}
            >
              New Post
            </Button>

            <div className={styles.postCardListScrollableContainer}>
              {blogPosts.map((post, i) => (
                <Card
                  className={
                    post.IsDraft
                      ? styles["postCard--grayedOut"]
                      : styles.postCard
                  }
                  key={post.PostId}
                >
                  <Card.Header className={styles.postCardHeader}>
                    <div className={styles.postCardHeaderTitleContainer}>
                      <span
                        className={styles.expandPostArrow}
                        onClick={() => {
                          let infoShownPostIndexesNew = [
                            ...infoShownPostIndexes,
                          ];
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
                            let newPosts = [...blogPosts];
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
                              setCurrentSaveState("NONE");
                            }
                          }
                        }}
                      >
                        <img
                          src="/icons/trash-24px.png"
                          className={styles.viewCountIcon}
                          alt={"Trash icon"}
                        />{" "}
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
                          setShowImagesIndex(undefined)

                          // when switching posts, set the save state back to none
                          setCurrentSaveState("NONE");
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
                      <pre>
                        {JSON.stringify(post, null, 2)}
                      </pre>
                    </Card.Content>
                  )}
                </Card>
              ))}
            </div>

            <DeploymentControls/>

          </Columns.Column>
          <Columns.Column size={9}>
            {blogPosts.length > 0 && showImagesIndex === undefined && (
              <BlogPostEditor
                saveState={currentSaveState} // SUCCESS, FAIL, NONE
                isDraftChangeHandler={isDraftChangeHandler}
                isEdited={
                  editedPostIndexes?.includes(activeBlogPostIndex) || false
                }
                images={imagesByPostShortId[blogPosts[activeBlogPostIndex].PostShortId]}
                postIndex={activeBlogPostIndex}
                initialData={blogPosts[activeBlogPostIndex]}
                saveBlogPostClickHandler={saveBlogPostClickHandler}
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
      )}
    </div>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  return {
    props: {},
  };
}

export default Admin;
