import { deleteBlogPostsDynamoDb } from "../../../util/dynamoDbUtil";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session/sessionOptions";
import { appCache, DYNAMO_BLOG_POSTS_CACHE_KEY } from "../../../util/nodeCache";
import { SessionDecorated } from "../../../interfaces/Session";

export default withIronSessionApiRoute(async function updateRoute(req, res) {
  const {
    body: { posts },
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

        console.log(posts);

        const awsRes = await deleteBlogPostsDynamoDb(
          process.env.BLOG_POSTS_DYNAMO_TABLE_NAME,
          posts
        );

        appCache.del(DYNAMO_BLOG_POSTS_CACHE_KEY);
        res.status(200).json({ updateStatusCodes: awsRes });
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
