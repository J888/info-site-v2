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

        let username = (session as SessionDecorated)?.user?.username;
        let admin = (session as SessionDecorated)?.user?.admin;

        if (!username) {
          res.status(404).send("Session does not exist");
          break;
        }

        res.status(200).send({
          username,
          admin,
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
