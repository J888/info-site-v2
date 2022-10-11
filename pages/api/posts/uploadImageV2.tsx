import nextConnect from 'next-connect';
import multer from 'multer';
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session/sessionOptions";
import fs from "fs";
import { uploadImage } from "../../../util/s3Util"
import { NextApiRequest, NextApiResponse } from 'next';
import { SessionDecorated } from '../../../interfaces/Session';
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const crypto = require('crypto');
const FILE_SIZE_TARGET_KB = 500;

interface MulterRequest extends Request {
  files: any;
  body: any;
  session: SessionDecorated
}

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const apiRoute = nextConnect({
  onError(error, _req: NextApiRequest, res: NextApiResponse) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array('imagefile'));

apiRoute.post(async (req: MulterRequest, res: NextApiResponse) => {

  let session = (req.session as SessionDecorated);
  if (!session?.user?.admin) {
    return res
      .status(401)
      .json({ error: "you must be logged in to make this request." });
  }

  const imageFile = req.files[0];

  const compressedFilePath = `./public/uploads/compressed_${crypto.randomUUID()}.jpg`
  // run ImageMagick to compress the image
  const convertCmd = `convert ${imageFile.path} -define jpeg:extent=${FILE_SIZE_TARGET_KB}kb ${compressedFilePath}`;
  console.log(`RUNNING ${convertCmd}`);
  const {stdout, stderr} = await exec(convertCmd);
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
  console.log('..DONE!')

  const imageData = fs.readFileSync(compressedFilePath);

  const { PostShortId } = req.body;

  const uploadRes = await uploadImage(
    process.env.IMG_S3_BUCKET,
    PostShortId,
    imageData,
    imageFile.originalname,
  )

  // now that S3 upload is done,
  fs.rmSync(imageFile.path); // remove the original non-compressed file
  fs.rmSync(compressedFilePath) // remove the compressed file
  res.status(200).json({ uploadRes });
});

// export default apiRoute;
export default withIronSessionApiRoute(apiRoute, sessionOptions);

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
