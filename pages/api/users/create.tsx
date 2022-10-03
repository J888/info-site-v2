import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session/sessionOptions";
import { SessionDecorated } from "../../../interfaces/Session";
import { getSiteUsers, saveUsers } from "../../../util/s3Util";
import crypto from "crypto";

interface UserCreate {
  username: string;
  password: string;
  isAdmin: boolean;
}

export default withIronSessionApiRoute(async function updateRoute(req, res) {
  const {
    body,
    method,
    session,
  } = req;

  switch (method) {
    case "POST":
      try {
        console.log((session as SessionDecorated)?.user)
        if (!(session as SessionDecorated)?.user?.admin) {
          return res
            .status(401)
            .json({ error: "you must be logged in to make this request." });
        }
        const user: UserCreate = body.user;
        const existingUsers = await getSiteUsers();
        const salt: crypto.BinaryLike = crypto.randomBytes(16).toString("hex");
        existingUsers[user.username] = {};
        existingUsers[user.username].salt = salt;
        existingUsers[user.username].hash = crypto.scryptSync(user.password, salt, 64).toString("hex");
        const awsRes = await saveUsers(existingUsers);
        res.status(201).json({ awsRes });
      } catch (err) {
        console.log(err);

        res.status(500).json({
          error: `image could not be uploaded: ${JSON.stringify(err, null, 2)}`,
        });
      }

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}, sessionOptions);
