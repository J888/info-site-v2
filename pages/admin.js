import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Columns, Container, Image, Section, Tag } from "react-bulma-components";
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
  updatePostHandler,
  postIndex,
  initialData,
  images,
  fetchImagesHandler,
  savePostHandler
}) => {
  useEffect(() => {
    if (!images) {
      fetchImagesHandler(initialData.PostId, initialData.Category);
    }
  });

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
          {initialData.Title}{initialData.IsNewPost ? ' [NEW]' : ''}
        </h1>
        <Button id={styles.editorSaveButton} onClick={() => {
          savePostHandler(initialData.PostId)
        }}>
          Save
        </Button>
      </div>

      <div className={styles.editedTag}>
      { isEdited ? <Tag color="warning">Edited</Tag> : <Tag color="white">Not Edited</Tag>  } 
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
                  newParts[i].ImageUrl = url;

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
              <img src={part.ImageUrl} style={{ maxWidth: "20rem" }} />
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
  const [imagesByPostId, setImagesByPostId] = useState({});
  const [activeBlogPostIndex, setActiveBlogPostIndex] = useState(0);
  const [editedPostIndexes, setEditedPostIndexes] = useState([]);
  const [infoShownPostIndexes, setInfoShownPostIndexes] = useState([]); // controls which posts to show info of
  
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

  const fetchImagesHandler = async (postId, category) => {
    const res = await axios.get(`/api/posts/images?postId=${postId}&category=${category}`);
    const { items } = res.data;
    
    let newImagesByPostId = {}
    Object.assign(newImagesByPostId, imagesByPostId);
    newImagesByPostId[postId] = items;
    setImagesByPostId(newImagesByPostId);
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

    const res = await axios.put(`api/posts/update/`, { posts: [blogPostData] });

    const { updateStatusCodes } = res?.data;
    console.log(`saving PostId: ${postId}`)
    console.log(`Status codes were [${updateStatusCodes.join(", ")}]`);
  }

  return (
    <div>
      {!loggedInAdmin && (
        <LogIn loginButtonClickHandler={loginButtonClickHandler} />
      )}
      {loggedInAdmin && <div>Logged in!</div>}
      {loginFailed && <div>Login Failed </div>}

      {loggedInAdmin &&

        <Columns>

          <Columns.Column size={3}>
            <h1 className={styles.postsHeader}>Posts</h1>
            <Button
              className={styles.newPostButton}
              onClick={() => {
                let newBlogPosts = [...blogPosts];
                newBlogPosts.push({
                  PostId: `post-${newBlogPosts.length + 1}-id`,
                  Category: "category-here",
                  Title: `Untitled ${newBlogPosts.length + 1}`,
                  CreatedAt: new Date().toLocaleString(),
                  Parts: [
                    {
                      Type: "MARKDOWN",
                      Contents: ADD_CONTENT,
                    },
                  ],
                  Tags: [],
                  IsNewPost: true
                });

                setBlogPosts(newBlogPosts);
                setActiveBlogPostIndex(newBlogPosts.length - 1);
              }}
            >
              New Post
            </Button>

            <div>
              {blogPosts.map((post, i) => (
                <Card className={styles[`postCard${ activeBlogPostIndex == i ? '--isActive' : ''}`] } key={post.PostId}>
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
                      >{infoShownPostIndexes.includes(i) ? "v" : ">"}</span>

                      <Card.Header.Title style={{marginLeft: '1rem'}} id={'postCardTitle'}>
                        {i + 1}. {post.Title}
                      </Card.Header.Title>
                    </div>

                    <div className={styles.postCardButtons}>
                      <Button
                        color={showImagesIndex == i ? "dark" : ""}
                        onClick={() => {
                          setActiveBlogPostIndex(i);
                          fetchImagesHandler(post.PostId, post.Category);

                          if(showImagesIndex) // deselect the image if navigate away
                            setImageFile(null);

                          setShowImagesIndex(
                            showImagesIndex == undefined ? i : undefined
                          );
                        }}
                      >
                        Images
                      </Button>

                      <Button
                        color=""
                        onClick={() => {
                          setActiveBlogPostIndex(i);
                        }}
                      >
                        Edit
                      </Button>

                    </div>
                  </Card.Header>
                  {infoShownPostIndexes.includes(i) && (
                    <Card.Content>
                      <div>PostId: {post.PostId}</div>
                      <div>Category: {post.Category}</div>
                      <div>Created at: {post.CreatedAt}</div>
                    </Card.Content>
                  )}
                </Card>
              ))}
            </div>
          </Columns.Column>
          <Columns.Column size={9}>
            {blogPosts.length > 0 && !showImagesIndex && (
              <BlogPostEditor
                isEdited={editedPostIndexes?.includes(activeBlogPostIndex) || false}
                images={imagesByPostId[blogPosts[activeBlogPostIndex].PostId]}
                fetchImagesHandler={fetchImagesHandler}
                postIndex={activeBlogPostIndex}
                initialData={blogPosts[activeBlogPostIndex]}
                saveBlogPostClickHandler={saveBlogPostClickHandler}
                updatePostHandler={updatePostHandler}
                savePostHandler={savePostHandler}
              />
            )}

            {showImagesIndex && (
              <Section>
                <h1>Images for "{blogPosts[showImagesIndex]?.Title}"</h1>
                <Container className={styles.postImagesContainer}>
                  {imagesByPostId[blogPosts[showImagesIndex]?.PostId]?.map(
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
      }
    </div>
  );
};

export async function getStaticProps({ params, preview = false, previewData }) {
  // const siteConfig = await getSiteFile(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3, `siteConfig.json`);

  return {
    props: {},
  };
}

export default Admin;
