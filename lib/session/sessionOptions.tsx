export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: `${process.env.SITE_IDENTIFIER}/user-session-cookie`,
}
