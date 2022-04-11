import { ReactNode } from "react";
import styles from "../sass/components/TextColoredBackground.module.scss";

type Props = {
  children?: ReactNode;
};

const TextColoredBackground = ({ children }: Props) => (
  <span className={styles.textColoredBackground}>
    {children}
  </span>
);

export default TextColoredBackground;
