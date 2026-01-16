const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const START_NUMBER = 6; // Start from 6 since you already have 1-5
const END_NUMBER = 15; // Change this to whatever number you want
const TEMPLATE_DIR = path.join(__dirname, 'site3');
const OUTPUT_BASE = __dirname;

// Read template file
const templateHtml = fs.readFileSync(path.join(TEMPLATE_DIR, 'index.html'), 'utf8');

// Function to generate a unique verify-trackunity hash (SHA256-like format)
function generateVerifyHash(siteNumber) {
    const hash = crypto.createHash('sha256');
    hash.update(`affiliate-test-sites-site${siteNumber}`);
    return hash.digest('hex');
}

console.log(`🚀 Starting site generation from ${START_NUMBER} to ${END_NUMBER}...\n`);

let created = 0;
let skipped = 0;

// Generate sites
for (let i = START_NUMBER; i <= END_NUMBER; i++) {
    const siteDir = path.join(OUTPUT_BASE, `site${i}`);

    // Skip if directory already exists
    if (fs.existsSync(siteDir)) {
        skipped++;
        continue;
    }

    // Create directory
    fs.mkdirSync(siteDir, { recursive: true });

    // Generate unique verify-trackunity hash for this site
    const verifyHash = generateVerifyHash(i);

    // Generate HTML with replaced numbers
    const htmlContent = templateHtml
        .replace(/Affiliate Test Site 3/g, `Affiliate Test Site ${i}`)
        .replace(/Affiliate test site 3/g, `Affiliate test site ${i}`)
        .replace(/Affiliate Offer Test 3/g, `Affiliate Offer Test ${i}`)
        .replace(/\/site3\//g, `/site${i}/`)
        .replace(/content="039b3b2c62800ea41db735af2cdbb0442b52df7d16a87ebade93faa94146c031"/g, `content="${verifyHash}"`);

    // Write index.html file
    fs.writeFileSync(path.join(siteDir, 'index.html'), htmlContent);

    created++;

    // Progress indicator every 50 sites
    if (created % 5 === 0) {
        console.log(`✅ Created ${created} sites so far... (currently at site${i})`);
    }
}

console.log(`\n✨ Complete!`);
console.log(`   Created: ${created} new sites`);
console.log(`   Skipped: ${skipped} existing sites`);
console.log(`   Total sites: site1 to site${END_NUMBER}`);