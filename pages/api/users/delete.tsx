import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session/sessionOptions";
import { SessionDecorated } from "../../../interfaces/Session";
import { getSiteUsers, saveUsers } from "../../../util/s3Util";

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
        const username: string = body.username;
        const existingUsers = await getSiteUsers();
        delete existingUsers[username]
        await saveUsers(existingUsers);
        res.status(204).send('');
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
