const { getSiteConfig } = require("../util/s3Util");
const fs = require("fs");

(async () => {
  const siteConfig = await getSiteConfig();

  if (!fs.existsSync("tmp")) {
    fs.mkdirSync("tmp");
    if (!fs.existsSync("tmp/cypressData")) {
      fs.mkdirSync("tmp/cypressData");
    }
  }
  fs.writeFileSync("tmp/cypressData/siteConfig.json", JSON.stringify(siteConfig, null, 2));
})()
