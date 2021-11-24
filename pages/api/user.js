import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session/sessionOptions";

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const {
      method,
      session
    } = req

    console.log(`GET /user`)

    switch (method) {
      case 'GET':

        res.status(200).send({
          username: session?.user?.username,
          admin: session?.user?.admin
        });
        
        break
      default:
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  },
  sessionOptions
);
