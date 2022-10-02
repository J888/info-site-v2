import styles from "../sass/components/Footer.module.scss";
import Logo from "./logo";
import { SocialIcon } from "react-social-icons";

type Props = {
  size: 'xxs' | 'xs' | 'sm' | 'm' | 'l';
};

const Divider = ({ size }: Props) => {
  let height = 0.0;
  if (size === 'xxs') {
    height = 1.5;
  } else if (size === 'xs') {
    height = 2.0;
  } else if (size === 'sm') {
    height = 2.5;
  } else if (size === 'm') {
    height = 3.0;
  } else if (size === 'l') {
    height = 3.5;
  } else if (size === 'xl') {
    height = 4.0;
  } else if (size === 'xxl') {
    height = 4.5;
  }
  return (<div style={{height: `${height}rem`}}></div>)
}

export default Divider;
