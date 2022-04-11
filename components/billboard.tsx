import { ReactNode } from "react";
import styles from "../sass/components/Billboard.module.scss";

type Props = {
  bodyComponent?: ReactNode;
  body?: string;
  title: string;
}

const Billboard = ({ title, body, bodyComponent }: Props) => (
  <div className={styles.billboard}>
    <h3>{title}</h3>
    {
      body && <p>{body}</p>
    }
    {bodyComponent}
  </div>
);

export default Billboard;
