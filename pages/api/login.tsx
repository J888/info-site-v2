import { withIronSessionApiRoute } from "iron-session/next";
import { SessionDecorated } from "../../interfaces/Session";
import { sessionOptions } from "../../lib/session/sessionOptions";
import { getSiteUsers } from "../../util/s3Util";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const crypto = require("crypto");

const Login = withIronSessionApiRoute(
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
          res.status(401).send({});
          break;
        }

        const hashS3 = userConfig["hash"];
        const saltS3 = userConfig["salt"];
        const derived = crypto.scryptSync(password, saltS3, 64).toString("hex");

        if (derived === hashS3) { // if password match
          (session as SessionDecorated).user = {
            username: username,
            admin: userConfig["admin"],
          };
          await (session as SessionDecorated).save();

          res.send({ session });
          break;
        } else { // passwords don't match. Unauthorized
          res.status(401).send({});
          break;
        }
      default:
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  },
  sessionOptions
);

export default Login;
