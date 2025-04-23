import prisma, { countsCache, lastCacheTime, CACHE_TTL, invalidateCountsCache } from "../helpers/prisma.js";

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
      totalCase,
      totalServices,
      totalYoutubeVideos,
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
      
      // Casestudy
      safeCount(prisma.caseStudy),
      
      // Services
      safeCount(prisma.service),
      
      // Youtube Videos
      safeCount(prisma.youTubeVideo),
      
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
        cases: {
          total: totalCase
        },
        services: {
          total: totalServices
        },
        youTubeVideo: {
          total: totalYoutubeVideos
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