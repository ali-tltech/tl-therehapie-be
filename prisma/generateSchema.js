
const fs = require('fs');
const path = require('path');
const commonFields = require('./baseSchema');

// Read all .prisma files from the schema directory
const schemaDir = path.join(__dirname, 'schema');
const schemaFiles = fs.readdirSync(schemaDir).filter(file => 
  file.endsWith('.prisma') && file !== 'schema.prisma'
);

// Main schema content (database connection, etc.)
const mainSchemaPath = path.join(schemaDir, 'schema.prisma');
let mainSchema = fs.readFileSync(mainSchemaPath, 'utf8');

// Combined schema content
let combinedSchema = mainSchema + '\n\n';

// Process each model schema file
schemaFiles.forEach(file => {
  const filePath = path.join(schemaDir, file);
  let modelContent = fs.readFileSync(filePath, 'utf8');
  
  // Find model declarations and inject common fields
  modelContent = modelContent.replace(/model\s+(\w+)\s+\{/g, (match, modelName) => {
    return `model ${modelName} {\n${commonFields}`;
  });
  
  combinedSchema += modelContent + '\n\n';
});

// Write the combined schema to the output file
const outputPath = path.join(__dirname, 'schema.prisma');
fs.writeFileSync(outputPath, combinedSchema);

console.log('Combined schema generated successfully!');