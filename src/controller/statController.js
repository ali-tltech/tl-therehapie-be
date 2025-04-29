import fetchReport from "../helpers/analytics.js";
import prisma, { countsCache, lastCacheTime, CACHE_TTL, invalidateCountsCache } from "../helpers/prisma.js";


const getDateRange = (req) => {
  const { startDate, endDate } = req.query;
  return {
    startDate: startDate || '30daysAgo',
    endDate: endDate || 'today',
  };
};

export const countryAnalytics = async (req, res) => {
  try {
    const dateRange = getDateRange(req);
    const result = await fetchReport(
      [{ name: 'totalUsers' }],
      [{ name: 'country' }],
      dateRange
    );

    if (!result?.length) {
      return res.status(404).json({
        success: false,
        message: 'No data found for country analytics.'
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching country analytics data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch country analytics data.'
    });
  }
};

export const activeUsers = async (req, res) => {
  try {
    const dateRange = getDateRange(req);
    const result = await fetchReport(
      [{ name: 'activeUsers' }],
      [],
      dateRange
    );

    if (!result?.length) {
      return res.status(404).json({
        success: false,
        message: 'No active users data found.'
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching active users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active users.'
    });
  }
};

export const engagedSessions = async (req, res) => {
  try {
    const dateRange = getDateRange(req);
    const result = await fetchReport(
      [{ name: 'engagedSessions' }],
      [],
      dateRange
    );

    if (!result?.length) {
      return res.status(404).json({
        success: false,
        message: 'No engaged sessions data found.'
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching engaged sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch engaged sessions.'
    });
  }
};

export const cityStats = async (req, res) => {
  try {
    const dateRange = getDateRange(req);
    const result = await fetchReport(
      [{ name: 'activeUsers' }],
      [{ name: 'city' }],
      dateRange
    );

    if (!result?.length) {
      return res.status(404).json({
        success: false,
        message: 'No city statistics found.'
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching city stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch city-wise stats.'
    });
  }
};

export const totalPageViews = async (req, res) => {
  try {
    const dateRange = getDateRange(req);
    const result = await fetchReport(
      [{ name: 'screenPageViews' }],
      [],
      dateRange
    );

    if (!result?.length) {
      return res.status(404).json({
        success: false,
        message: 'No page view data found.'
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching page views:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch total page views.'
    });
  }
};

export const bounceRate = async (req, res) => {
  try {
    const dateRange = getDateRange(req);
    const result = await fetchReport(
      [{ name: 'bounceRate' }],
      [],
      dateRange
    );

    if (!result?.length) {
      return res.status(404).json({
        success: false,
        message: 'No bounce rate data found.'
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching bounce rate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bounce rate.'
    });
  }
};

export const pageViewsByPage = async (req, res) => {
  try {
    const dateRange = getDateRange(req);
    const result = await fetchReport(
      [{ name: 'screenPageViews' }], // Changed to array for consistency
      [{ name: 'pagePath' }],
      dateRange
    );

    if (!result?.length) {
      return res.status(404).json({
        success: false,
        message: 'No page-wise view data found.'
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching page views by page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch page views by page.'
    });
  }
};

export const fullPageData = async (req, res) => {
  try {
    const dateRange = getDateRange(req);
    const result = await fetchReport(
      [
        { name: 'screenPageViews' },
        { name: 'sessions' },
        { name: 'activeUsers' },
        { name: 'eventCount' },
        { name: 'engagementRate' },
      ],
      [
        { name: 'pagePath' },
        { name: 'pageTitle' },
      ],
      dateRange
    );

    if (!result?.length) {
      return res.status(404).json({
        success: false,
        message: 'No full page data found.'
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching full page data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch full page data.'
    });
  }
};

export const trafficSources = async (req, res) => {
  try {
    const dateRange = getDateRange(req);
    const result = await fetchReport(
      [
        { name: 'sessions' },
        { name: 'totalUsers' }
      ],
      [
        { name: 'sessionDefaultChannelGroup' }  // GA4's default channel grouping
      ],
      dateRange
    );

    if (!result?.length) {
      return res.status(404).json({
        success: false,
        message: 'No traffic sources data found.'
      });
    }

    // Process data for all main traffic channels
    const processedData = result.map(item => ({
      channel: item.sessionDefaultChannelGroup,
      sessions: parseInt(item.sessions),
      users: parseInt(item.totalUsers)
    })).filter(item =>
      // Include all major traffic channels
      [
        'Organic Search',
        'Paid Search',
        'Direct',
        'Referral',
        'Social',
        'Email',
        'Display',
        'Affiliates'
      ].includes(item.channel)
    );

    // Calculate total sessions for percentage
    const totalSessions = processedData.reduce((sum, item) => sum + item.sessions, 0);

    // Add percentage to each channel
    const finalData = processedData.map(item => ({
      ...item,
      percentage: ((item.sessions / totalSessions) * 100).toFixed(1)
    }));

    // Sort by number of sessions descending
    finalData.sort((a, b) => b.sessions - a.sessions);

    res.json({
      success: true,
      data: finalData,
      summary: {
        totalSessions,
        totalUsers: finalData.reduce((sum, item) => sum + item.users, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching traffic sources data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch traffic sources data.'
    });
  }
};

export const sessionDurationDistribution = async (req, res) => {
  try {
    const dateRange = getDateRange(req);

    // Fetch session duration data
    const result = await fetchReport(
      [{ name: 'averageSessionDuration' }], // GA4 metric for session duration
      [{ name: 'sessionSourceMedium' }],   // Optional dimension for grouping by source
      dateRange
    );

    if (!result?.length) {
      return res.status(404).json({
        success: false,
        message: 'No session duration data found.'
      });
    }

    // Format the data for the frontend
    const formattedData = result.map(item => ({
      source: item.sessionSourceMedium || 'Unknown',
      avgSessionDuration: parseFloat(item.averageSessionDuration).toFixed(2) // Average duration in seconds
    }));

    // Sort by session duration descending
    formattedData.sort((a, b) => b.avgSessionDuration - a.avgSessionDuration);

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('Error fetching session duration data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch session duration data.'
    });
  }
};




//
export const totalEnquiries = async (req, res) => {
  try {
    const totalEnquiries = await prisma.enquiries.count();

    return res.status(200).json({
      success: true,
      data: totalEnquiries,
    });
  } catch (error) {
    console.error("Error fetching total enquiries:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const totalNewsletterSubscribers = async (req, res) => {
  try {
    const totalSubscribers = await prisma.newsletter.count();

    return res.status(200).json({
      success: true,
      data: totalSubscribers,
    });
  } catch (error) {
    console.error("Error fetching total newsletter subscribers:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const totalBlogs = async (req, res) => {
  try {
    const totalBlogs = await prisma.blog.count();

    return res.status(200).json({
      success: true,
      data: totalBlogs,
    });
  } catch (error) {
    console.error("Error fetching total blog count:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
export const totalCase = async (req, res) => {
  try {
    const totalCases = await prisma.caseStudy.count();

    return res.status(200).json({
      success: true,
      data: totalCases,
    });
  } catch (error) {
    console.error("Error fetching total case Study count:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const totalCareers = async (req, res) => {
  try {
    const totalCarrers = await prisma.careers.count();

    return res.status(200).json({
      success: true,
      data: totalCarrers,
    });
  } catch (error) {
    console.error("Error fetching total carrers count:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const totalServices = async (req, res) => {
  try {
    const totalService = await prisma.service.count();
    return res.status(200).json({
      success: true,
      data: totalService,
    });
  } catch (error) {
    console.error("Error fetching total Service count:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


export const totalUser = async (req, res) => {
  try {
    const totaluser = await prisma.user.count();
    return res.status(200).json({
      success: true,
      data: totaluser,
    });
  } catch (error) {
    console.error("Error fetching total Users count:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
export const totalFaq = async (req, res) => {
  try {
    const totalfaq = await prisma.fAQ.count();
    return res.status(200).json({
      success: true,
      data: totalfaq,
    });
  } catch (error) {
    console.error("Error fetching total Faq count:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export const enquiryStats = async (req, res) => {
  try {
    // Get the current date and calculate 7 days ago
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Fetch enquiries created in the last 7 days
    const enquiries = await prisma.enquiries.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    const groupedData = {};
    enquiries.forEach((enquiry) => {
      const date = enquiry.createdAt.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      groupedData[date] = (groupedData[date] || 0) + 1;
    });

    // Create chart-compatible data
    const chartData = [["Date", "Enquiries"]];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split("T")[0];
      chartData.push([formattedDate, groupedData[formattedDate] || 0]);
    }

    res.json(chartData.reverse());
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}






//*******Total Counts***********

// Helper function to safely execute counts
const safeCount = async (model, where = {}) => {
  try {
    if (!model) return 0;
    return await model.count({ where });
  } catch (error) {
    console.error(`Error counting model:`, error);
    return 0; // Return 0 instead of failing the entire request
  }
};

export const totalCounts = async (req, res) => {
  try {
    // Check if cache is still valid
    const now = Date.now();
    const skipCache = req.query.skipCache === 'true';

    if (!skipCache && countsCache && (now - lastCacheTime < CACHE_TTL)) {
      // Return cached data
      return res.json({
        ...countsCache,
        meta: {
          ...countsCache.meta,
          cached: true
        }
      });
    }

    const startTime = performance.now();

    // Execute all count queries in parallel
    const [
      totalClients,
      activeClients,
      totalBlogs,
      totalServices,
      totalUser,
      totalFaq,
      totalTestimonials,
      totalCatalogues,
      activeCatalogues,
      unreadEnquiries,
      totalEnquiries,
      totalNewsletterSubscribers,
      unreadNotifications,
      activeSocialLinks,
    ] = await Promise.all([
      // Clients
      safeCount(prisma.client),
      safeCount(prisma.client, { isActive: true }),

      // Blogs
      safeCount(prisma.blog),

      // Services
      safeCount(prisma.service),

      // Users
      safeCount(prisma.user),

      // Faq
      safeCount(prisma.fAQ),

      // Testimonials
      safeCount(prisma.testimonial),

      // Catalogues
      safeCount(prisma.catalogue),
      safeCount(prisma.catalogue, { isActive: true }),

      // Enquiries
      safeCount(prisma.enquiries, { status: "unread" }),
      safeCount(prisma.enquiries),

      // Newsletter Subscribers
      safeCount(prisma.newsletter),

      // Unread Notifications
      safeCount(prisma.notification, { isRead: false }),

      // Active Social Links
      safeCount(prisma.social, { isActive: true }),
    ]);

    // Build response object with metadata
    const responseObject = {
      success: true,
      meta: {
        cached: false,
        executionTimeMs: Math.round(performance.now() - startTime),
        timestamp: new Date().toISOString()
      },
      counts: {
        clients: {
          total: totalClients,
          active: activeClients
        },
        blogs: {
          total: totalBlogs
        },
        services: {
          total: totalServices
        },
        users: {
          total: totalUser
        },
        faqs: {
          total: totalFaq
        },
        testimonials: {
          total: totalTestimonials
        },
        catalogues: {
          total: totalCatalogues,
          active: activeCatalogues
        },
        enquiries: {
          total: totalEnquiries,
          unread: unreadEnquiries
        },
        newsletter: {
          subscribers: totalNewsletterSubscribers
        },
        notifications: {
          unread: unreadNotifications
        },
        social: {
          active: activeSocialLinks
        },
        // Add these fields to match what your sidebar expects
        carrers: {
          total: 0 // Default to 0 since this model isn't in your schema yet
        },
        team: {
          active: 0 // Default to 0 since this model isn't in your schema yet
        }
      }
    };

    // Update the shared cache - Use the invalidateCountsCache function to clear first
    // Then use the provided functions from prisma.js to update shared state
    Object.assign(global, {
      countsCache: responseObject,
      lastCacheTime: now
    });

    res.json(responseObject);

  } catch (error) {
    console.error("Error in totalCounts controller:", error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch counts",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Optional: Selective counts endpoint for better performance
export const selectiveCounts = async (req, res) => {
  try {
    const { entities } = req.query;
    const requestedEntities = entities ? (Array.isArray(entities) ? entities : entities.split(',')) : [];

    const counts = {};
    const countPromises = [];

    // Only fetch requested entities
    if (requestedEntities.includes('clients') || requestedEntities.length === 0) {
      countPromises.push(
        Promise.all([
          safeCount(prisma.client),
          safeCount(prisma.client, { isActive: true })
        ]).then(([total, active]) => {
          counts.clients = { total, active };
        })
      );
    }

    if (requestedEntities.includes('blogs') || requestedEntities.length === 0) {
      countPromises.push(
        safeCount(prisma.blog).then(total => {
          counts.blogs = { total };
        })
      );
    }

    // Add other entities as needed...
    if (requestedEntities.includes('cases') || requestedEntities.length === 0) {
      countPromises.push(
        safeCount(prisma.caseStudy).then(total => {
          counts.cases = { total };
        })
      );
    }

    if (requestedEntities.includes('services') || requestedEntities.length === 0) {
      countPromises.push(
        safeCount(prisma.service).then(total => {
          counts.services = { total };
        })
      );
    }

    // Add the carrers and team entities your sidebar expects
    if (requestedEntities.includes('carrers') || requestedEntities.length === 0) {
      counts.carrers = { total: 0 };
    }

    if (requestedEntities.includes('team') || requestedEntities.length === 0) {
      counts.team = { active: 0 };
    }

    // Continue with other entities...

    await Promise.all(countPromises);

    res.json({
      success: true,
      counts
    });

  } catch (error) {
    console.error("Error in selectiveCounts controller:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch selective counts"
    });
  }
};