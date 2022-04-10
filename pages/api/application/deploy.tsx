import { createBlogPostsDynamoDb } from "../../../util/dynamoDbUtil";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session/sessionOptions";
import axios from "axios";
import { SessionDecorated } from "../../../interfaces/Session";

export default withIronSessionApiRoute(async function updateRoute(req, res) {
  const {
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

        const digitalOceanRes = await axios.post(
          `${process.env.DIGITAL_OCEAN_API_BASE_URL}/apps/${process.env.DIGITAL_OCEAN_APP_ID}/deployments`,
          {
            "force_build": true
          },
          {
            headers: {
              "Authorization": `Bearer ${process.env.DIGITAL_OCEAN_PAT}`
            }
          }
        )

        res.status(200).json({ deploymentId: digitalOceanRes?.data?.deployment?.id });
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
