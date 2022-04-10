import { ReactNode, useState } from "react";
import styles from "../sass/components/ShowMoreToggle.module.scss";

type Props = {
  children?: ReactNode;
  className: string;
  labelHide: string;
  labelShow: string;
  title: string;
  titleSize: number;
};

const ShowMoreToggle = ({
  children,
  labelShow,
  labelHide,
  title,
  titleSize,
  className,
}: Props) => {
  labelHide = labelHide === undefined ? `hide.` : labelHide;
  let [shown, setShown] = useState(true);
  return (
    <div className={className}>
      <h3 className={styles[`showMoreToggleTitle-size${titleSize}`]}>
        {title}
      </h3>
      <span
        onClick={() => {
          setShown(!shown);
        }}
        className={styles.showMoreButton}
      >
        {shown ? labelHide : labelShow}
      </span>
      {shown && <div className={styles.showMoreContent}>{children}</div>}
    </div>
  );
};

export default ShowMoreToggle;
