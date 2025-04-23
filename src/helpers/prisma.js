import { PrismaClient } from '@prisma/client';

// Create Prisma client instance
const prisma = new PrismaClient();

// Cache management variables - exported so statController can access them
export let countsCache = null;
export let lastCacheTime = 0;
export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Function to invalidate cache
export const invalidateCountsCache = () => {
  countsCache = null;
  lastCacheTime = 0;
  console.log('Stats cache invalidated');
};

// List of models that affect the dashboard stats
const statsModels = [
  'client',
  'blog',
  'caseStudy',
  'service',
  'youTubeVideo',
  'user',
  'fAQ',
  'testimonial',
  'catalogue',
  'enquiries',
  'newsletter',
  'notification',
  'social'
  // 'carrer' and 'team' can be added later when you implement these models
];

// Operations that modify data
const writeOperations = [
  'create',
  'update',
  'delete',
  'updateMany',
  'deleteMany',
  'upsert'
];

// Register middleware to automatically invalidate cache
statsModels.forEach(model => {
  writeOperations.forEach(action => {
    prisma.$use(async (params, next) => {
      // Check if this operation should trigger cache invalidation
      if (params.model === model && params.action === action) {
        // Execute the database operation
        const result = await next(params);
        
        // Invalidate cache after operation completes
        invalidateCountsCache();
        
        return result;
      }
      
      // For other operations, just pass through
      return next(params);
    });
  });
});

// Export the enhanced Prisma client as default
export default prisma;