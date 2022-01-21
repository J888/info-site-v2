import styles from "../sass/components/Billboard.module.scss";

const Billboard = ({ title, body, bodyComponent }) => (
  <div className={styles.billboard}>
    <h3>{title}</h3>
    {
      body && <p>{body}</p>
    }
    {bodyComponent}
  </div>
);

export default Billboard;
