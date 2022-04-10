import styles from "../sass/components/ImageUploadEditor.module.scss";
import React, { useState } from "react";
import axios from "axios";
import { Button, Container } from "react-bulma-components";
import FD from "form-data";
import ActionableImageList from "./actionableImageList";
import { API_ENDPOINTS } from "../lib/constants";
import { ImageAction, ImageData } from "../interfaces/Image";

type Props = {
  fetchImagesHandler: (PostShortId: string) => void;
  images: Array<ImageData>;
  postShortId: string;
  title: string;
};

const ImageUploadEditor = ({
  images,
  postShortId,
  title,
  fetchImagesHandler,
}) => {
  const [imageFileToBeUploaded, setImageFileToBeUploaded] = useState(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);

  return (
    <div>
      <h1 style={{ marginBottom: "2rem" }}>Images for &quot;{title}&quot;</h1>
      <Container className={styles.postImagesContainer}>
        <ActionableImageList
          images={images}
          actionHandler={async (imageKey, action) => {
            if (action === ImageAction.DELETE) {
              const deleteRes = await axios.delete(
                `${API_ENDPOINTS.IMAGES}/${postShortId}/${imageKey}`
              );
              if (deleteRes.status === 204) {
                await fetchImagesHandler(postShortId);
              }
            }
          }}
        />
      </Container>
      <Container>
        <h1>Upload image</h1>
        {imageFileToBeUploaded && <p>{imageFileToBeUploaded.name}</p>}
        {imageFileToBeUploaded == null && (
          <input
            type="file"
            id="avatar"
            name="imagebuff"
            accept="image/png, image/jpeg"
            onInput={async (e) => {
              setImageUploadSuccess(false);
              let file = (e.target as HTMLInputElement).files[0];
              setImageFileToBeUploaded(file);
            }}
          ></input>
        )}

        {imageFileToBeUploaded && (
          <div>
            <Button
              onClick={async () => {
                const fd = new FD();
                fd.append("imagefile", imageFileToBeUploaded);
                fd.append("PostShortId", postShortId);
                const res = await fetch(API_ENDPOINTS.IMAGE_UPLOAD, {
                  method: "POST",
                  body: fd,
                });
                setImageUploadSuccess(res.status === 200);
                if (res.status === 200) {
                  await fetchImagesHandler(postShortId);
                  setImageFileToBeUploaded(null);
                }
              }}
            >
              {"Upload"}
            </Button>
            <Button
              onClick={() => {
                setImageFileToBeUploaded(null);
              }}
            >
              {"Cancel"}
            </Button>
          </div>
        )}

        {imageUploadSuccess && (
          <div>
            <span style={{ color: "green" }}>Upload successful!</span>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ImageUploadEditor;
