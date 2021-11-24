import { getImagesByPostId } from "../../../util/s3Util";

export default async (req, res) => {
  const { category, postId } = req.query;

  try {
    const items = await getImagesByPostId(process.env.IMG_S3_BUCKET, category, postId);
    // console.log({
    //   bucket: process.env.IMG_S3_BUCKET, c: category, p: postId
    // })
    // console.log(items);

    return res.status(200).json({ items });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
