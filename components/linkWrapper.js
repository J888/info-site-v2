import Link from "next/link";

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
