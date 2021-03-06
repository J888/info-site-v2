const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const propertyId = 292605692; //'YOUR-GA4-PROPERTY-ID';

export const getPageViewsBySlug = async (startDate) => {

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

  return viewsBySlug;
}
