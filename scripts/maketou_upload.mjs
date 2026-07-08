// This script uses the Playwright page from agent-browser's context
// We'll intercept the page and use its API directly

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  // Launch a new browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Login to Maketou
  await page.goto('https://app.maketou.com/en/login');
  await page.fill('input[type="email"]', 'sacjoibrahim@gmail.com');
  await page.fill('input[type="password"]', '92007266Sk*');
  await page.click('button:has-text("Sign In")');
  await page.waitForURL('**/en**', { timeout: 15000 });
  
  // Navigate to store
  await page.click('a:has-text("Studio creatif")');
  await page.waitForURL('**/stores/**', { timeout: 15000 });
  await page.waitForLoadState('networkidle');
  
  // Go to Products
  await page.click('a:has-text("Products")');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Click New Product
  await page.click('button:has-text("New Product")');
  await page.waitForTimeout(2000);
  
  // Fill product name
  await page.fill('input[type="text"]', 'Service Studio Créatif');
  
  // Check Services
  await page.click('label:has-text("Services")');
  await page.waitForTimeout(500);
  
  // Upload cover image - use the file chooser approach
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.click('text=Drag your file')
  ]);
  await fileChooser.setFiles(path.join(__dirname, '..', 'upload', 'studio_cover.png'));
  await page.waitForTimeout(3000);
  
  // Fill description
  await page.fill('textarea', 'Service de création de contenu numérique : design graphique, montage vidéo, marketing digital, création de sites web et plus encore.');
  
  // Click Continue
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(3000);
  
  // Select Pay What You Want
  await page.click('button:has-text("Billing Type")');
  await page.waitForTimeout(500);
  await page.click('text=Pay What You Want');
  await page.waitForTimeout(500);
  
  // Set prices
  await page.fill('input[placeholder*="minimum"]', '100');
  await page.fill('input[placeholder*="suggested"]', '5000');
  
  // Click Continue to step 3
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(3000);
  
  // Take screenshot of final step
  await page.screenshot({ path: path.join(__dirname, '..', 'upload', 'maketou_step3.png') });
  console.log('Page URL:', page.url());
  
  // Get the page content
  const content = await page.content();
  
  // Look for publish/create button
  const buttons = await page.locator('button').allTextContents();
  console.log('Buttons:', buttons);
  
  // If there's a Publish button, click it
  const publishBtn = page.locator('button:has-text("Publish"), button:has-text("Create")');
  if (await publishBtn.count() > 0) {
    await publishBtn.first().click();
    await page.waitForTimeout(5000);
    console.log('Published! URL:', page.url());
    
    // Look for product ID in URL
    const url = page.url();
    const match = url.match(/products\/([a-f0-9-]+)/);
    if (match) {
      console.log('PRODUCT_ID:', match[1]);
    }
  }
  
  await browser.close();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
