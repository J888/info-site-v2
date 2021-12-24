import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session/sessionOptions";
import { getSiteUsers } from "../../util/s3Util";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const crypto = require("crypto");

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const {
      method,
      body: { username, password },
      session
    } = req

    switch (method) {
      case 'POST':
        const usersByUsername = await getSiteUsers();
        const userConfig = usersByUsername[username];

        if (!userConfig) {
          res.send({ ok: true });
        }

        const hashS3 = userConfig["hash"];
        const saltS3 = userConfig["salt"];
        const derived = crypto.scryptSync(password, saltS3, 64).toString("hex");

        if (derived === hashS3) { // if password match
          session.user = {
            username: username,
            admin: userConfig["admin"],
          };
          await session.save();
          
        }

        res.send({ ok: true });
        
        break
      default:
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  },
  sessionOptions
);
