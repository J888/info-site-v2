
import { withIronSessionApiRoute } from "iron-session/next";
import { SessionDecorated } from "../../../interfaces/Session";
import { sessionOptions } from "../../../lib/session/sessionOptions";
import { deleteFileS3 } from "../../../util/s3Util";

export default withIronSessionApiRoute(async function imagesRoute(req, res) {
  const {
    method,
    session,
  } = req;

  switch (method) {
    case "DELETE":
      try {
        console.log((session as SessionDecorated)?.user)
        if (!(session as SessionDecorated)?.user?.admin) {
          return res
            .status(401)
            .json({ error: "you must be logged in to make this request." });
        }

        const [ PostShortId, filename ] = req.query.shortIdSlashFileName
        const deleteRes = await deleteFileS3(process.env.IMG_S3_BUCKET, PostShortId, filename);
        console.log(deleteRes)
        if (deleteRes[`$metadata`].httpStatusCode === 204) {
          return res.status(204).send({});
        } else {
          return res.status(500).send("could not delete image");

        }
      } catch (err) {
        console.log(err);

        res.status(500).json({
          error: `could not complete request: ${JSON.stringify(err, null, 2)}`,
        });
      }

      break;
    default:
      res.setHeader("Allow", ["DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}, sessionOptions);
