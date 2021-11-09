// propertyId = 'YOUR-GA4-PROPERTY-ID';

// Imports the Google Analytics Data API client library.
const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const propertyId = 292605692;

export default async (req, res) => {
  const startDate = req.query.startDate || "2021-11-06";
  const slug = req.query.slug;

  try {
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
    });

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate: 'today'
        }
      ],
      dimensions: [
        {
          name: 'pagePath'
        }
      ],
      metrics: [
        {
          name: 'screenPageViews'
        }
      ]
    })

    const viewsBySlug = {}
    for (let row of response.rows) {
      const rowSlug = row.dimensionValues[0].value;
      const viewCount = parseInt(row.metricValues[0].value);
      viewsBySlug[rowSlug] = viewCount;
    }

    let views = viewsBySlug[slug] || 0;

    return res.status(200).json({ views })
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
