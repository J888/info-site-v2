import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session/sessionOptions";
import { SessionDecorated } from "../../../interfaces/Session";
import { getSiteUsers, initBlankJson, redeemInvite, saveUsers } from "../../../util/s3Util";
import crypto from "crypto";

interface UserCreate {
  username: string;
  password: string;
  isAdmin: boolean;
}

export default withIronSessionApiRoute(async function createRoute(req, res) {
  const {
    body,
    method,
    session
  } = req;

  switch (method) {
    case "POST":
      try {
        console.log(body)
        let inviteRedeemed = false;
        if (body.invite?.code && body.invite?.code?.length > 0) {
          console.log(`>>> redeeming invite code...`)
          inviteRedeemed = await redeemInvite(process.env.STATIC_FILES_BUCKET,
                                process.env.SITE_FOLDER_S3,
                                body.invite.code);
          
          if (!inviteRedeemed) {
            console.log(`<<<< invite could not be redeemed >>`);
          }
          
          // create users s3 folder
          await initBlankJson('users/users.json');
          await initBlankJson('siteConfig.json');
        }

        let isAuthorized = ((session as SessionDecorated)?.user?.admin === true) || inviteRedeemed;

        if (!isAuthorized) {
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
        existingUsers[user.username].admin = !!user.isAdmin;
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
