import fs from 'fs'

// Step 1: Read the environment variable
const serverBaseUrl = process.env.SERVER_BASE_URL;

if (!serverBaseUrl) {
  console.info('Config: SERVER_BASE_URL environment variable is missing. Using default value.');
  process.exit(0);
}

// Step 2: Define the content template
const contentTemplate = `
export const ENVIRONMENT = {
  databaseUrl: "{{SERVER_BASE_URL}}/database",
}
`;

// Step 3: Replace the placeholder with the actual value
const finalContent = contentTemplate.replace('{{SERVER_BASE_URL}}', serverBaseUrl);

// Step 4: Write the final content to a file
fs.writeFile('./modules/core/env.ts', finalContent, (err) => {
  if (err) {
    console.error('Config: Error writing to file:', err);
    process.exit(0);
  }
  console.log('Config: File written updated.');
});
