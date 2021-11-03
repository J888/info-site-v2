import styles from "../sass/components/Billboard.module.scss";

const Billboard = ({ title, body }) => (
  <div className={styles.billboard}>
    <h3>{title}</h3>
    <p>{body}</p>
  </div>
);

export default Billboard;
