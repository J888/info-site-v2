import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session/sessionOptions";
import axios from "axios";
import { SessionDecorated } from "../../../interfaces/Session";

export default withIronSessionApiRoute(async function getDeploymentRoute(req, res) {
  const {
    method,
    query: { deploymentId },
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

        const digitalOceanRes = await axios.get(
          `${process.env.DIGITAL_OCEAN_API_BASE_URL}/apps/${process.env.DIGITAL_OCEAN_APP_ID}/deployments/${deploymentId}`,
          {
            headers: {
              "Authorization": `Bearer ${process.env.DIGITAL_OCEAN_PAT}`
            }
          }
        )

        let deploymentData = digitalOceanRes?.data?.deployment;
        let steps = deploymentData.progress.steps.map(step => `name: ${step.name}, status: ${step.status}`)

        res.status(200).json({ 
          id: deploymentData.id,
          phase: deploymentData.phase,
          steps
        });
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
