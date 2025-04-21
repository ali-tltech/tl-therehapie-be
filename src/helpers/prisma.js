import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
 // Optional: Enables logging
});

export default prisma;