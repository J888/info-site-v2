import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session/sessionOptions";
import { SessionDecorated } from "../../../interfaces/Session";
import { getSiteUsers } from "../../../util/s3Util";

export default withIronSessionApiRoute(async function updateRoute(req, res) {
  const {
    method,
    session,
  } = req;

  switch (method) {
    case "GET":
      try {
        console.log((session as SessionDecorated)?.user)
        if (!(session as SessionDecorated)?.user?.admin) {
          return res
            .status(401)
            .json({ error: "you must be logged in to make this request." });
        }
        
        const users = await getSiteUsers();
        res.status(200).json({ users });
      } catch (err) {
        console.log(err);

        res.status(500).json({
          error: `image could not be uploaded: ${JSON.stringify(err, null, 2)}`,
        });
      }

      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}, sessionOptions);
