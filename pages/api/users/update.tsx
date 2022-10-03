import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session/sessionOptions";
import { appCache, DYNAMO_BLOG_POSTS_CACHE_KEY } from "../../../util/nodeCache";
import { SessionDecorated } from "../../../interfaces/Session";
import { getSiteUsers, saveSiteConfig, saveUsers } from "../../../util/s3Util";
import crypto from "crypto";

interface UserUpdate {
  username: string;
  password: string;
}

export default withIronSessionApiRoute(async function updateRoute(req, res) {
  const {
    body,
    method,
    session,
  } = req;

  switch (method) {
    case "PUT":
      try {
        console.log((session as SessionDecorated)?.user)
        if (!(session as SessionDecorated)?.user?.admin) {
          return res
            .status(401)
            .json({ error: "you must be logged in to make this request." });
        }
        const user: UserUpdate = body.user;
        const existingUsers = await getSiteUsers();
        const salt: crypto.BinaryLike = crypto.randomBytes(16).toString("hex");
        existingUsers[user.username].salt = salt;
        existingUsers[user.username].hash = crypto.scryptSync(user.password, salt, 64).toString("hex");
        const awsRes = await saveUsers(existingUsers);
        res.status(200).json({ awsRes });
      } catch (err) {
        console.log(err);

        res.status(500).json({
          error: `image could not be uploaded: ${JSON.stringify(err, null, 2)}`,
        });
      }

      break;
    default:
      res.setHeader("Allow", ["PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}, sessionOptions);
