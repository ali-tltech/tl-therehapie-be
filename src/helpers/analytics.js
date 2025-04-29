import { BetaAnalyticsDataClient } from '@google-analytics/data';
import 'dotenv/config';

const analyticsDataClient = new BetaAnalyticsDataClient();



const propertyId = process.env.GA_PROPERTY_ID;
// Helper function to fetch data from GA4
async function fetchReport(metrics, dimensions, dateRange) {
  try {
      const [response] = await analyticsDataClient.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [{
              startDate: dateRange.startDate,
              endDate: dateRange.endDate
          }],
          metrics,
          dimensions,
      });

      return response.rows.map(row => {
          const result = {};
          if (dimensions) {
              const dimensionArray = Array.isArray(dimensions) ? dimensions : [dimensions];
              dimensionArray.forEach((dimension, index) => {
                  result[dimension.name] = row.dimensionValues[index]?.value || 'Unknown';
              });
          }
          
          const metricArray = Array.isArray(metrics) ? metrics : [metrics];
          metricArray.forEach((metric, index) => {
              result[metric.name] = row.metricValues[index]?.value || 0;
          });
          return result;
      });
  } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error; // Propagate the original error for better debugging
  }
}

export default fetchReport;