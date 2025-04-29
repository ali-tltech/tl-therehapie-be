import express from "express";
import { totalCounts, selectiveCounts, countryAnalytics, activeUsers, engagedSessions, cityStats, totalPageViews, bounceRate, pageViewsByPage, fullPageData, trafficSources, sessionDurationDistribution, totalEnquiries, totalNewsletterSubscribers, totalBlogs, totalServices, enquiryStats } from "../../controller/statController.js";
import verifyJwtToken from "../../middlewares/verifyJwtToken.js";

const router = express.Router();

// Protected routes that require authentication
router.get("/total-counts", verifyJwtToken, totalCounts);
router.get("/selective-counts", verifyJwtToken, selectiveCounts); //  can use as GET /api/admin/stats/selective-counts?entities=clients,blogs

//analytics statistics
router.get("/country-analytics", countryAnalytics )
router.get("/active-users", activeUsers )
router.get('/engaged-sessions',engagedSessions)
router.get('/city-stats',cityStats)
router.get('/total-page-views',totalPageViews)
router.get('/bounce-rate',bounceRate)
router.get('/page-views-by-page',pageViewsByPage)
router.get('/full-page-data',fullPageData)
router.get('/traffic-sources',trafficSources)
router.get('/session-duration',sessionDurationDistribution)

router.get('/total-enquiries',totalEnquiries)
router.get('/total-subscribers',totalNewsletterSubscribers)
router.get('/total-blogs',totalBlogs)
router.get('/total-services',totalServices)
router.get('/enquiries/last-7-days',enquiryStats)

export default router;