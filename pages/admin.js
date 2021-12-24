import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Columns, Container, Image, Section, Tag } from "react-bulma-components";
import shortUUID from "short-uuid";
import styles from "../sass/components/Admin.module.scss"
const ADD_CONTENT = "Add content. . .";

const LogIn = ({ loginButtonClickHandler }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
      Login
      <div>
        <input
          placeholder="username"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        ></input>
        <input
          placeholder="password"
          type="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            loginButtonClickHandler(username, password);
          }}
        >
          Log in
        </button>
      </div>
    </div>
  );
};

const BlogPostEditor = ({
  isEdited,
  isDraftChangeHandler,
  updatePostHandler,
  postIndex,
  initialData,
  images,
  saveState,
  savePostHandler
}) => {
  const AddPartButtons = ({ insertPartAfterIndex }) => (
    <React.Fragment>
      <button
        onClick={() => {
          let newParts = [...initialData.Parts];

          newParts.splice(insertPartAfterIndex + 1, 0, {
            Type: "IMAGE",
          });

          let newBlogPostData = {};
          Object.assign(newBlogPostData, initialData);
          newBlogPostData.Parts = newParts;

          updatePostHandler(postIndex, newBlogPostData);
        }}

        disabled={!images || !images?.length > 0}
      >
        + image
      </button>
      <button
        onClick={() => {
          let newParts = [...initialData.Parts];

          newParts.splice(insertPartAfterIndex + 1, 0, {
            Type: "MARKDOWN",
            Contents: ADD_CONTENT,
          });

          let newBlogPostData = {};
          Object.assign(newBlogPostData, initialData);
          newBlogPostData.Parts = newParts;

          updatePostHandler(postIndex, newBlogPostData);
        }}
      >
        + text
      </button>
    </React.Fragment>
  );

  const genericOnChangeAttrUpdater = (e, attrKey) => {
    let newBlogPostData = {};
    Object.assign(newBlogPostData, initialData);
    newBlogPostData[attrKey] = e.target.value;
    updatePostHandler(postIndex, newBlogPostData);
  };

  return (
    <div>
      <div className={styles.editorTitleContainer}>
        <h1 className={styles.titleEditing}>
          {initialData.Title}
          {initialData.IsNewPost ? " [NEW]" : ""}
        </h1>
        <Button
          id={styles.editorSaveButton}
          onClick={() => {
            savePostHandler(initialData.PostId);
          }}
        >
          Save
        </Button>
      </div>
{/* 
      {saveState === "NONE" && (
        <div className={styles.postSaveStateTag}>
          {isEdited ? (
            <Tag color="warning">Edited</Tag>
          ) : (
            <Tag color="white">Not Edited</Tag>
          )}
        </div>
      )}

      {saveState === "SUCCESS" && (
        <div className={styles.postSaveStateTag}>
          <Tag color="success">Saved</Tag>
        </div>
      )}
      {saveState === "FAIL" && (
        <div className={styles.postSaveStateTag}>
          <Tag color="danger">Save Failed</Tag>
        </div>
      )} */}

      <div className={styles.editorPostShortIdTagGroup}>
        <Tag.Group hasAddons>
            {isEdited && saveState==="NONE" && <Tag color="warning">Edited</Tag>}
            {!isEdited && saveState==="NONE" && <Tag color="info">Up to date</Tag>}
            {saveState === "SUCCESS" && <Tag color="success">Saved!</Tag>}
            {saveState === "FAIL" && <Tag color="danger">Save Failed</Tag>}
          <Tag color="light">{initialData.PostShortId}</Tag>

        </Tag.Group>
      </div>

      <label>Title</label>
      <input
        placeholder={"Edit Title"}
        className={styles.titleInput}
        value={initialData.Title}
        onChange={(e) => {
          genericOnChangeAttrUpdater(e, "Title");
        }}
      ></input>

      <div className={styles.editorIsDraftCheckbox}>
        <label>Draft</label>
        <input
          type="checkbox"
          checked={initialData.IsDraft === true}
          onChange={()=> {
            isDraftChangeHandler(postIndex);
          }}
        ></input>
      </div>

      <label>SubTitle</label>
      <input
        placeholder={"Edit SubTitle"}
        className={styles.titleInput}
        value={initialData.SubTitle}
        onChange={(e) => {
          genericOnChangeAttrUpdater(e, "SubTitle");
        }}
      ></input>

      <label>Description</label>
      <input
        placeholder={"Edit Description"}
        className={styles.titleInput}
        value={initialData.Description}
        onChange={(e) => {
          genericOnChangeAttrUpdater(e, "Description");
        }}
      ></input>

      <label>Category</label>
      <input
        placeholder={"Edit Category"}
        className={styles.categoryInput}
        value={initialData.Category}
        onChange={(e) => {
          genericOnChangeAttrUpdater(e, "Category");
        }}
      ></input>

      <label>PostId / slug</label>
      <input
        placeholder={"Edit PostId"}
        className={styles.categoryInput}
        value={initialData.PostId}
        onChange={(e) => {
          genericOnChangeAttrUpdater(e, "PostId");
        }}
      ></input>

      <label>Tags</label>
      <input
        placeholder={"Edit Tags"}
        className={styles.categoryInput}
        value={initialData.Tags.join(",")}
        onChange={(e) => {
          let newBlogPostData = {};
          Object.assign(newBlogPostData, initialData);
          newBlogPostData.Tags = e.target.value.split(",");
          updatePostHandler(postIndex, newBlogPostData);
        }}
        onBlur={(e) => {
          let newBlogPostData = {};
          Object.assign(newBlogPostData, initialData);
          newBlogPostData.Tags = e.target.value
            .split(",")
            .filter((tag) => tag != "");
          updatePostHandler(postIndex, newBlogPostData);
        }}
      ></input>

      <label>CreatedAt</label>
      <input
        placeholder={"Edit CreatedAt - MM/DD/YYYY, HH:MM:SS AM/PM"}
        className={styles.categoryInput}
        value={initialData.CreatedAt}
        onChange={(e) => {
          genericOnChangeAttrUpdater(e, "CreatedAt");
        }}
      ></input>

      <div className={styles.editorMainImageContainer}>
        <label>Main image:</label>
        <select
          name="images"
          id="images"
          onChange={(event) => {
            if (!event.target.value) {
              return;
            }

            let url = images.find(
              (image) => image.Key === event.target.value
            ).Url;

            let newBlogPostData = {};
            Object.assign(newBlogPostData, initialData);
            newBlogPostData.ImageS3Url = url;
            newBlogPostData.ImageKey = event.target.value;

            updatePostHandler(postIndex, newBlogPostData);
          }}
        >
          <option key={"blank-option"}></option>
          {images?.map((image) => (
            <option value={image.Key} key={image.Key}>
              {image.Key}
            </option>
          ))}
        </select>
        <Image
          src={initialData.ImageS3Url}
          alt={initialData.ImageKey}
          className={styles.editorMainImage}
        />
      </div>

      <AddPartButtons insertPartAfterIndex={-1} />

      {initialData.Parts.map((part, i) => {
        if (part.Type === "MARKDOWN") {
          return (
            <div
              key={`${i}-${initialData.PostId}-md-part`}
              className={styles.mdPartEditor}
            >
              <span
                className={styles.redDotDeleteMdPart}
                onClick={() => {
                  let newParts = [...initialData.Parts];
                  newParts.splice(i, 1); // .splice(index, howManyToDelete)

                  let newBlogPostData = {};
                  Object.assign(newBlogPostData, initialData);
                  newBlogPostData.Parts = newParts;

                  updatePostHandler(postIndex, newBlogPostData);
                }}
              ></span>
              <textarea
                className={styles.textAreaEditor}
                value={part.Contents != ADD_CONTENT ? part.Contents : undefined}
                placeholder={
                  part.Contents == ADD_CONTENT ? ADD_CONTENT : undefined
                }
                onChange={(e) => {
                  let newParts = [...initialData.Parts];
                  newParts[i].Contents = e.target.value;

                  let newBlogPostData = {};
                  Object.assign(newBlogPostData, initialData);
                  newBlogPostData.Parts = newParts;

                  updatePostHandler(postIndex, newBlogPostData);
                }}
              ></textarea>

              <AddPartButtons insertPartAfterIndex={i} />

              <br />
            </div>
          );
        } else if (part.Type === "IMAGE") {
          return (
            <div
              className={styles.imagePartSelect}
              key={`${i}-${initialData.PostId}-image-part`}
            >
              <span
                className={styles.redDotDeleteImgPart}
                onClick={() => {
                  let newParts = [...initialData.Parts];
                  newParts.splice(i, 1); // .splice(index, howManyToDelete)

                  let newBlogPostData = {};
                  Object.assign(newBlogPostData, initialData);
                  newBlogPostData.Parts = newParts;

                  updatePostHandler(postIndex, newBlogPostData);
                }}
              ></span>
              <p className={styles.selectImageLabel}>Select image: </p>
              <select
                name="images"
                id="images"
                onChange={(event) => {
                  if (!event.target.value) {
                    return;
                  }

                  let url = images.find(
                    (image) => image.Key === event.target.value
                  ).Url;

                  let newParts = [...initialData.Parts];
                  newParts[i].Contents = url;

                  let newBlogPostData = {};
                  Object.assign(newBlogPostData, initialData);
                  newBlogPostData.Parts = newParts;

                  updatePostHandler(postIndex, newBlogPostData);
                }}
              >
                <option></option>
                {images?.map((image) => (
                  <option value={image.Key} key={image.Key}>
                    {image.Key}
                  </option>
                ))}
              </select>
              <img src={part.Contents} style={{ maxWidth: "20rem" }} />
              <AddPartButtons insertPartAfterIndex={i} />
            </div>
          );
        }
      })}
    </div>
  );
};

const getCurrentUser = async () => {
  const res = await axios.get(`api/user`);
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
  const [deploymentId, setDeploymentId] = useState(null);
  const [deploymentDetails, setDeploymentDetails] = useState(null);
  
  const [imageFile, setImageFile] = useState(null);

  // Controls what post to show images for, if any
  const [showImagesIndex, setShowImagesIndex] = useState(undefined);

  useEffect(async () => {

    if(!loggedInAdmin) {
      let user = await getCurrentUser();
      if (user?.admin) {
        setLoggedInAdmin(true)
      }
    }

    if (blogPosts.length == 0) {
      getBlogPosts();
    }
  });

  const loginButtonClickHandler = async (providedUsername, password) => {
    await axios.post(`/api/login`, {
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
    const res = await axios.get(`/api/posts/all`);
    const { items } = res.data;
    setBlogPosts(items);
  }

  const fetchImagesHandler = async (PostShortId) => {
    const res = await axios.get(`/api/posts/images?PostShortId=${PostShortId}`);
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

    let newEditedPostIndexes = [...editedPostIndexes]
    newEditedPostIndexes.push(atIndex)
    setEditedPostIndexes(newEditedPostIndexes)
  }

  const savePostHandler = async (postId) => {

    let blogPostData = blogPosts.find(post => post.PostId === postId);

    if (!blogPostData.IsNewPost) {
      const res = await axios.put(`api/posts/update/`, { posts: [blogPostData] });

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
      const res = await axios.post(`api/posts/create/`, { posts: [blogPostData] });

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
    const res = await axios.post(`api/posts/delete`, { posts: [blogPostData] });
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
        <LogIn loginButtonClickHandler={loginButtonClickHandler} />
      )}
      {loggedInAdmin && <div>Logged in!</div>}
      {loginFailed && <div>Login Failed </div>}

      {loggedInAdmin && (
        <Columns>
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
                        />{" "}
                      </Button>

                      <Button
                        className={styles.postCardImagesButton}
                        color={showImagesIndex == i ? "dark" : ""}
                        onClick={() => {
                          setActiveBlogPostIndex(i);
                          fetchImagesHandler(post.PostShortId);

                          if (showImagesIndex)
                            // deselect the image if navigate away
                            setImageFile(null);

                          console.log(`showImagesIndex: ${showImagesIndex}`);
                          setShowImagesIndex(
                            showImagesIndex === undefined ? i : undefined
                          );
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
                      <div>PostId: {post.PostId}</div>
                      <div>PostShortId: {post.PostShortId}</div>
                      <div>Category: {post.Category}</div>
                      <div>Created at: {post.CreatedAt}</div>
                    </Card.Content>
                  )}
                </Card>
              ))}
            </div>

            <Button color="warning"
              style={{marginRight: '0.4rem'}}
              onClick={async () => {
                let confirmed = confirm(`are you sure you want to rebuild the site? This will start a new deployment`);
                // alert(`confirm was ${confirmed}, DIGITAL_OCEAN_API_BASE_URL=${process.env.DIGITAL_OCEAN_API_BASE_URL}`)

                if (confirmed === true) {
                  let deployRes = await axios.post(`api/application/deploy`, {})
                  console.log(deployRes.data);

                  setDeploymentId(deployRes.data.deploymentId)
                }
                
              }}
            >Rebuild App
            </Button>

            <Button color="info"
              disabled={deploymentId===null}
              onClick={async () => {
                let deployRes = await axios.get(`api/application/getDeployment?deploymentId=${deploymentId}`);
                console.log(deployRes.data);
                setDeploymentDetails(JSON.stringify(deployRes.data, null, 2))
              }}
            >Deployment Details
            </Button>

            <Tag.Group hasAddons className={styles.deploymentIdTagGroup}>
              <Tag color="black">DeploymentId</Tag>
              <Tag>{deploymentId !== null ? deploymentId : "No deployment started"}</Tag>
            </Tag.Group>

            <div>
              {deploymentDetails === null && <span>No deployment details</span>}
              {deploymentDetails !== null && <pre>{deploymentDetails}</pre>}
            </div>

            
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
                <h1>Images for "{blogPosts[showImagesIndex]?.Title}"</h1>
                <Container className={styles.postImagesContainer}>
                  {imagesByPostShortId[blogPosts[showImagesIndex]?.PostShortId]?.map(
                    (image) => {
                      
                      return (
                        <div key={image.Key}>
                          <Image src={image.Url} size={128} />
                        </div>
                      );
                    }
                  )}
                </Container>
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
