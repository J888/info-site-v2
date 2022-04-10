import { getPageViewsBySlug } from "../../lib/google_analytics/pageViewRetrieval";

const PageViews = async (req, res) => {
  const slug = req.query.slug;

  try {
    const viewsMappedBySlug = await getPageViewsBySlug("2021-11-25");
    let views = viewsMappedBySlug[slug] || 0;

    return res.status(200).json({ views })
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default PageViews;
