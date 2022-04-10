import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  href: string;
}

const LinkWrapper = ({ children, href, wrapInAnchor, ...props }) => (
  wrapInAnchor ? 
  <Link href={href} {...props} passHref >
    <a>{children}</a>
  </Link>
  :
  <Link href={href} {...props} passHref >
    {children}
  </Link>
)

export default LinkWrapper;
