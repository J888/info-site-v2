import { withIronSessionApiRoute } from "iron-session/next";
import { SessionDecorated } from "../../interfaces/Session";
import { sessionOptions } from "../../lib/session/sessionOptions";
import { getSiteUsers } from "../../util/s3Util";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const crypto = require("crypto");

const LogOut = withIronSessionApiRoute(
  async function logoutRoute(req, res) {
    const {
      method,
      session
    } = req

    switch (method) {
      case 'POST':
        session.destroy();
        return res.send({ ok: true });
      default:
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  },
  sessionOptions
);

export default LogOut;
