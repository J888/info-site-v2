import React, { useState } from "react";
import { Button, Image, Tag } from "react-bulma-components";
import PostContent from "../components/postContent";
import styles from "../sass/components/BlogPostEditor.module.scss"
const ADD_CONTENT = "Add content. . .";

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

  const [showPreview, setShowPreview] = useState(false);

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
      <button
        onClick={() => {
          let newParts = [...initialData.Parts];

          newParts.splice(insertPartAfterIndex + 1, 0, {
            Type: "TWEET_SINGLE",
            Contents: '',
          });

          let newBlogPostData = {};
          Object.assign(newBlogPostData, initialData);
          newBlogPostData.Parts = newParts;

          updatePostHandler(postIndex, newBlogPostData);
        }}
      >
        + tweet
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

        <div>
          <Button
            id={styles.editorSaveButton}
            onClick={() => {
              savePostHandler(initialData.PostId);
            }}
          >
            Save
          </Button>
          <Button
            id={styles.previewButton}
            onClick={() => {
              setShowPreview(!showPreview);
            }}
          >
            {showPreview == false ? 'Preview' : 'Edit'}
          </Button>

        </div>
       
      </div>
      <div className={styles.editorPostShortIdTagGroup}>
        <Tag.Group hasAddons>
            {isEdited && saveState==="NONE" && <Tag color="warning">Edited</Tag>}
            {!isEdited && saveState==="NONE" && <Tag color="info">Up to date</Tag>}
            {saveState === "SUCCESS" && <Tag color="success">Saved!</Tag>}
            {saveState === "FAIL" && <Tag color="danger">Save Failed</Tag>}
          <Tag color="light">{initialData.PostShortId}</Tag>
        </Tag.Group>
      </div>
      {
        showPreview == true &&
        <PostContent data={initialData} views={0} twitterUsername={'Preview'}/>
      }

      {
        !(showPreview == true) &&
        <div className={styles.editorForm}>
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
                  <img src={part.Contents} style={{ maxWidth: "20rem" }} alt={`Image for part ${i}`} />
                  <AddPartButtons insertPartAfterIndex={i} />
                </div>
              );
            } else if (part.Type === "TWEET_SINGLE") {
              return (
                <div
                  key={`${i}-${initialData.PostId}-tweet-single-part`}
                  className={styles.tweetSinglePartEditor}
                >
                  <label>Tweet Single: </label>
                  <span
                    className={styles.redDotDeleteTweetPart}
                    onClick={() => {
                      let newParts = [...initialData.Parts];
                      newParts.splice(i, 1); // .splice(index, howManyToDelete)

                      let newBlogPostData = {};
                      Object.assign(newBlogPostData, initialData);
                      newBlogPostData.Parts = newParts;

                      console.log(`new parts`)
                      console.log(newBlogPostData.Parts)

                      updatePostHandler(postIndex, newBlogPostData);
                    }}
                  ></span>
                  <input
                    placeholder={"Tweet-Id"}
                    value={part.Contents}
                    onChange={(e) => {
                      let newParts = [...initialData.Parts];
                      newParts[i].Contents = e.target.value;

                      let newBlogPostData = {};
                      Object.assign(newBlogPostData, initialData);
                      newBlogPostData.Parts = newParts;

                      updatePostHandler(postIndex, newBlogPostData);
                    }}
                  ></input>

                  <AddPartButtons insertPartAfterIndex={i} />

                  <br />
                </div>
              );
            }
          })}

        </div>
      }
      
    </div>
  );
};

export default BlogPostEditor;
