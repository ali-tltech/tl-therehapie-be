


// It includes common fields that are shared across multiple models.

module.exports = `
  id        String   @id @default(uuid())
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  createdBy String?
  updatedBy String?
`;