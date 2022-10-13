import styles from "../sass/components/Footer.module.scss";
import Logo from "./logo";
import { SocialIcon } from "react-social-icons";

type Props = {
  logoUrl: string;
  tagline: string;
  twitterUsername: string;
  siteName: string;
};

const Footer = ({ logoUrl, twitterUsername, tagline, siteName }: Props) => (
  <footer className={styles.footer}>
    <div className={styles.logo}>
      <Logo logoUrl={logoUrl} siteName={siteName}/>
    </div>
    <div>{`© ${new Date().getFullYear()} - ${tagline}`}</div>
    <div className={styles.twitterIcon}>
      <SocialIcon
        url={`https://twitter.com/${twitterUsername}`}
        bgColor={"rgb(77, 77, 77)"}
        style={{ height: 26, width: 26 }}
      />
    </div>
  </footer>
);

export default Footer;
