import { isInviteCodeValid } from "../../../util/s3Util";

const Verify = async (req, res) => {
  try {
    const valid: boolean = await isInviteCodeValid(
      process.env.STATIC_FILES_BUCKET,
      process.env.SITE_FOLDER_S3,
      req.body.code
    );

    if (valid) {
      return res.status(200).json({ message: "valid" });
    } else {
      return res.status(404).json({ message: "invalid" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default Verify;
