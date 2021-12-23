import { useState } from "react";
import styles from "../sass/components/ShowMoreToggle.module.scss";

const ShowMoreToggle = ({ children, labelShow, labelHide, title, titleSize }) => {

  labelHide = labelHide === undefined ? `hide.` : labelHide;
  let [shown, setShown] = useState(false)
  return (
    <div>
      <h3 className={styles[`showMoreToggleTitle-size${titleSize}`]}>{title}</h3>
      <span onClick={()=> {
        setShown(!shown);
      }}
      className={styles.showMoreButton}
      >{shown ? labelHide : labelShow}</span>
      {shown && <div className={styles.showMoreContent}>{children}</div>}
    </div>
  );
};

export default ShowMoreToggle;
