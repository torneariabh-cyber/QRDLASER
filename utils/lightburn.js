const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Simulated LightBurn integration
async function generateLightBurnFile(ticket) {
  try {
    // Create a simple SVG file with the text
    const svgContent = generateSVG(ticket);
    const filename = `${ticket.id}.svg`;
    const filepath = path.join(__dirname, '../../output', filename);
    
    await fs.writeFile(filepath, svgContent);
    console.log(`Generated SVG file: ${filepath}`);
    
    return filepath;
  } catch (error) {
    console.error('Error generating LightBurn file:', error);
    throw error;
  }
}

function generateSVG(ticket) {
  const { name, font, icon } = ticket;
  
  // Basic SVG template
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="500" height="200" xmlns="http://www.w3.org/2000/svg">
  <style>
    text {
      font-family: "${font || 'Arial'}";
      font-size: 48px;
      fill: black;
    }
  </style>
  <text x="250" y="100" text-anchor="middle">${name}</text>`;

  // Add icon if present
  if (icon) {
    svg += `
  <text x="250" y="160" text-anchor="middle" font-size="24px">${icon}</text>`;
  }

  svg += `
</svg>`;

  return svg;
}

// Simulated LightBurn communication
async function sendToLightBurn(filepath, ticket) {
  console.log(`Sending ${filepath} to LightBurn...`);
  
  // In production, you would use LightBurn's API or command line interface
  // This is a simulation
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log(`Successfully sent to LightBurn for ticket: ${ticket.id}`);
  
  // Here you would actually call LightBurn
  // Example: await execPromise(`lightburn "${filepath}"`);
  
  return true;
}

module.exports = {
  generateLightBurnFile,
  sendToLightBurn
};
