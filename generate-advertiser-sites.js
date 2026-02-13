const fs = require('fs');
const path = require('path');

// Configuration
const START_NUMBER = 5;
const END_NUMBER = 50;
const TEMPLATE_DIR = path.join(__dirname, 'local-advertiser1');
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
    const advertiserDir = path.join(OUTPUT_BASE, `local-advertiser${i}`);

    // Skip if directory already exists
    if (fs.existsSync(advertiserDir)) {
        skipped++;
        continue;
    }

    // Create directory
    fs.mkdirSync(advertiserDir, { recursive: true });

    // Generate HTML with replaced numbers
    const htmlContent = templateHtml
        .replace(/Local Test Advertiser 1 Landing/g, `Local Test Advertiser ${i} Landing`)
        .replace(/Local Test Advertiser 1/g, `Local Test Advertiser ${i}`);

    // Write files
    fs.writeFileSync(path.join(advertiserDir, 'index.html'), htmlContent);
    fs.writeFileSync(path.join(advertiserDir, 'index.js'), templateJs);
    fs.writeFileSync(path.join(advertiserDir, 'styles.css'), templateCss);

    created++;

    // Progress indicator every 50 sites
    if (created % 10 === 0) {
        console.log(`✅ Created ${created} sites so far... (currently at advertiser${i})`);
    }
}

console.log(`\n✨ Complete!`);
console.log(`   Created: ${created} new sites`);
console.log(`   Skipped: ${skipped} existing sites`);
console.log(`   Total sites: local-advertiser1 to local-advertiser${END_NUMBER}`);