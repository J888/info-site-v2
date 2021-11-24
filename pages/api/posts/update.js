import { updateBlogPostsDynamoDb } from "../../../util/dynamoDbUtil";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session/sessionOptions";

export default withIronSessionApiRoute(async function updateRoute(req, res) {
  const {
    body: { posts },
    method,
    session,
  } = req;

  switch (method) {
    case "PUT":
      try {
        console.log(session?.user)
        if (!session?.user?.admin) {
          return res
            .status(401)
            .json({ error: "you must be logged in to make this request." });
        }

        const awsRes = await updateBlogPostsDynamoDb(
          process.env.BLOG_POSTS_DYNAMO_TABLE_NAME,
          posts
        );

        res.status(200).json({ updateStatusCodes: awsRes });
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
