import { getBlogPostsDynamoDb } from "../../../util/dynamoDbUtil";

export default async (req, res) => {

  try {
    const items = await getBlogPostsDynamoDb(process.env.BLOG_POSTS_DYNAMO_TABLE_NAME);

    return res.status(200).json({ items })
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
