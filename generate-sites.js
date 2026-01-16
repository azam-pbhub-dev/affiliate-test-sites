const fs = require('fs');
const path = require('path');

// Configuration
const START_NUMBER = 7; // Start from 7 since you already have 1-6
const END_NUMBER = 15; // Change this to whatever number you want
const TEMPLATE_DIR = path.join(__dirname, 'advertiser1');
const OUTPUT_BASE = __dirname;

// Read template files
const templateHtml = fs.readFileSync(path.join(TEMPLATE_DIR, 'index.html'), 'utf8');
const templateJs = fs.readFileSync(path.join(TEMPLATE_DIR, 'index.js'), 'utf8');
const templateCss = fs.readFileSync(path.join(TEMPLATE_DIR, 'styles.css'), 'utf8');

console.log(`🚀 Starting site generation from ${START_NUMBER} to ${END_NUMBER}...\n`);

let created = 0;
let skipped = 0;

// Generate sites
for (let i = START_NUMBER; i <= END_NUMBER; i++) {
    const advertiserDir = path.join(OUTPUT_BASE, `advertiser${i}`);

    // Skip if directory already exists
    if (fs.existsSync(advertiserDir)) {
        skipped++;
        continue;
    }

    // Create directory
    fs.mkdirSync(advertiserDir, { recursive: true });

    // Generate HTML with replaced numbers
    const htmlContent = templateHtml
        .replace(/Test Advertiser 1 Landing/g, `Test Advertiser ${i} Landing`)
        .replace(/Test Advertiser 1/g, `Test Advertiser ${i}`);

    // Write files
    fs.writeFileSync(path.join(advertiserDir, 'index.html'), htmlContent);
    fs.writeFileSync(path.join(advertiserDir, 'index.js'), templateJs);
    fs.writeFileSync(path.join(advertiserDir, 'styles.css'), templateCss);

    created++;

    // Progress indicator every 50 sites
    if (created % 5 === 0) {
        console.log(`✅ Created ${created} sites so far... (currently at advertiser${i})`);
    }
}

console.log(`\n✨ Complete!`);
console.log(`   Created: ${created} new sites`);
console.log(`   Skipped: ${skipped} existing sites`);
console.log(`   Total sites: advertiser1 to advertiser${END_NUMBER}`);