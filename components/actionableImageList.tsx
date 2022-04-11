import styles from "../sass/components/ActionableImageList.module.scss";
import { Button } from "react-bulma-components";
import { ImageAction, ImageData } from "../interfaces/Image";

type Props = {
  images: Array<ImageData>;
  actionHandler: (imageKey: string, action: ImageAction) => void;
};

const ActionableImageList = ({ images, actionHandler }: Props) => (
  <div className={styles.container}>
    {images?.map((image) => (
      <div key={image.Key} className={styles.itemContainer}>
        <Button
          className={styles.deleteButton}
          color="danger"
          onClick={() => {
            let deleteConfirmed = confirm(`Delete ${image.Key}?`);
            if (deleteConfirmed === true) {
              actionHandler(image.Key, ImageAction.DELETE);
            }
          }}
        >
          X
        </Button>
        <div>{image.Key}</div>
        <img
          src={image.Url}
          alt={`Image for ${image.Key}`}
          className={styles.image}
        ></img>
      </div>
    ))}
  </div>
);

export default ActionableImageList;
