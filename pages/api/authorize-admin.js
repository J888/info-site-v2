import { getSiteFile } from "../../util/s3Util";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const crypto = require("crypto");

export default async (req, res) => {
  const {
    method,
    body: { username, password }
  } = req

  switch (method) {
    case 'POST':
      const usersByUsername = await getSiteFile(process.env.STATIC_FILES_S3_BUCKET, process.env.SITE_FOLDER_S3, `users/users.json`);
      const userConfig = usersByUsername[username];
      if (!userConfig) {
        return res.status(200).json(
          { 
            username,
            loggedIn: false,
            admin: false
          }
        ) 
      }

      const hashS3 = userConfig["hash"];
      const saltS3 = userConfig["salt"];
      const derived = crypto.scryptSync(password, saltS3, 64).toString("hex");

      res.status(200).json(
        { 
          username,
          loggedIn: derived === hashS3,
          admin: true
        }
      ) 
      break
    default:
      res.setHeader('Allow', ['POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }

  res.status(200).json({ method  })
}
