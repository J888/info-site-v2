import styles from "../sass/components/TextColoredBackground.module.scss";

const TextColoredBackground = ({ children }) => (
  <span className={styles.textColoredBackground}>
    {children}
  </span>
);

export default TextColoredBackground;
