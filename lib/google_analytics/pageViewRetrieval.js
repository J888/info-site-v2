import { fakePageViewsBySlug } from "../../util/fakeDataUtil";

const { BetaAnalyticsDataClient } = require("@google-analytics/data");

export const getPageViewsBySlug = async (startDate) => {

  if (process.env.MOCK_DATA && process.env.MOCK_DATA_POST_COUNT) {
    return fakePageViewsBySlug();
  }

  const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    },
  });

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${parseInt(process.env.GOOGLE_ANALYTICS_VIEW_ID)}`, // your ga 4 property id?
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
