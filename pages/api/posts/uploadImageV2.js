import nextConnect from 'next-connect';
import multer from 'multer';
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session/sessionOptions";
import fs from "fs";
import { uploadImage } from "../../../util/s3Util"

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array('imagefile'));

apiRoute.post(async (req, res) => {
  if (!req.session?.user?.admin) {
    return res
      .status(401)
      .json({ error: "you must be logged in to make this request." });
  }

  const imageFile = req.files[0];
  const imageData = fs.readFileSync(imageFile.path);
  console.log(imageData);
  console.log(req.body.PostShortId);
  console.log(process.env.IMG_S3_BUCKET);

  const { PostShortId } = req.body;

  const uploadRes = await uploadImage(
    process.env.IMG_S3_BUCKET,
    PostShortId,
    imageData,
    imageFile.originalname,
  )

  // remove file once it's uploaded to s3. Not needed on filesystem.
  fs.rmSync(req.files[0].path);
  res.status(200).json({ uploadRes });
});

// export default apiRoute;
export default withIronSessionApiRoute(apiRoute, sessionOptions);

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
