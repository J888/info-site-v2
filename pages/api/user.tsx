import { withIronSessionApiRoute } from "iron-session/next";
import { SessionDecorated } from "../../interfaces/Session";
import { sessionOptions } from "../../lib/session/sessionOptions";

const User = withIronSessionApiRoute(
  async function loginRoute(req, res) {
    const {
      method,
      session
    } = req

    console.log(`GET /user`)

    switch (method) {
      case 'GET':

        res.status(200).send({
          username: (session as SessionDecorated)?.user?.username,
          admin: (session as SessionDecorated)?.user?.admin
        });
        
        break
      default:
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
  },
  sessionOptions
);

export default User;
