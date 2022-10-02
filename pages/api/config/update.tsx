import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session/sessionOptions";
import { appCache, DYNAMO_BLOG_POSTS_CACHE_KEY } from "../../../util/nodeCache";
import { SessionDecorated } from "../../../interfaces/Session";
import { saveSiteConfig } from "../../../util/s3Util";

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
        const awsRes = await saveSiteConfig(body);
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
