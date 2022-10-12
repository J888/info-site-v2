import { getImagesByPostId } from "../../../util/s3Util";

const Images = async (req, res) => {
  const { PostShortId } = req.query;

  try {
    const items = await getImagesByPostId(process.env.PUBLIC_FILES_BUCKET, PostShortId);

    return res.status(200).json({ items });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default Images;
