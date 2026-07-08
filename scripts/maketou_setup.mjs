import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG = path.join(__dirname, '..', 'upload', 'studio_cover.png');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // 1. Login
  console.log('1. Login...');
  await page.goto('https://app.maketou.com/en/login', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'sacjoibrahim@gmail.com');
  await page.fill('input[type="password"]', '92007266Sk*');
  await page.click('button:has-text("Sign In")');
  await page.waitForURL('**/en**', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);
  console.log('  Logged in:', page.url());

  // 2. Open store
  console.log('2. Open store...');
  await page.click('a:has-text("Studio creatif")').catch(() => {});
  await page.waitForTimeout(3000);

  // 3. Go to Products
  console.log('3. Products...');
  await page.locator('a:has-text("Products")').first().click();
  await page.waitForTimeout(3000);

  // 4. New Product
  console.log('4. New Product...');
  await page.click('button:has-text("New Product")').catch(() => {});
  await page.waitForTimeout(2000);

  // 5. Step 1: Name + Services + Image + Description
  console.log('5. Step 1...');
  await page.locator('input[type="text"]').first().fill('Service Studio Créatif');
  await page.locator('label:has-text("Services")').click().catch(() => {});
  await page.waitForTimeout(500);

  // Upload image
  console.log('6. Upload...');
  const [fc] = await Promise.all([
    page.waitForEvent('filechooser', { timeout: 5000 }),
    page.locator('text=Drag your file').click()
  ]);
  await fc.setFiles(IMG);
  await page.waitForTimeout(4000);
  console.log('  Image uploaded');

  // Description
  await page.locator('textarea').first().fill('Service de création de contenu numérique : design graphique, montage vidéo, marketing digital, création de sites web.');

  // Continue to Step 2
  console.log('7. Step 2...');
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(3000);

  // 8. Step 2: Billing = Pay What You Want
  console.log('8. Billing Type...');
  // Click billing type button to open dropdown
  await page.locator('button').filter({ hasText: /One-time Price|Billing/ }).first().click();
  await page.waitForTimeout(1000);
  
  // Select Pay What You Want
  await page.locator('[role="option"]').filter({ hasText: 'Pay What You Want' }).click();
  await page.waitForTimeout(1000);

  // Set minimum price
  const minInput = page.locator('input[type="number"], input[role="spinbutton"]').first();
  await minInput.fill('100');
  await page.waitForTimeout(500);

  // Continue to Step 3
  console.log('9. Step 3...');
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(3000);

  // 10. Step 3: Publish
  console.log('10. Publish...');
  await page.screenshot({ path: path.join(__dirname, '..', 'upload', 'step3.png') });
  const btns = await page.locator('button').allTextContents();
  console.log('  Buttons:', btns.filter(b => b.trim()).join(', '));

  // Try each possible publish button
  for (const txt of ['Publish', 'Create Product', 'Create', 'Save', 'Finish', 'Publier', 'Créer']) {
    const btn = page.locator(`button:has-text("${txt}")`).first();
    if (await btn.isVisible().catch(() => false)) {
      console.log(`  Clicking "${txt}"...`);
      await btn.click();
      await page.waitForTimeout(5000);
      console.log('  URL:', page.url());
      break;
    }
  }

  // 11. Get product ID from products list
  console.log('11. Get Product ID...');
  // Navigate to products page
  const storeUrl = page.url().match(/\/stores\/[^/]+/)?.[0];
  if (storeUrl) {
    await page.goto(`https://app.maketou.com${storeUrl}/products`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    // Get all product links
    const hrefs = await page.locator('a[href*="product"]').allAttributeContents('href');
    console.log('  Product hrefs:', JSON.stringify(hrefs));
    
    for (const href of hrefs) {
      const m = href.match(/products\/([a-f0-9-]{36})/i);
      if (m) console.log('PRODUCT_ID=' + m[1]);
    }

    // Also check table rows for product IDs
    const rows = await page.locator('tr, [role="row"]').allTextContents();
    console.log('  Rows:', JSON.stringify(rows.slice(0, 5)));
  }

  await browser.close();
  console.log('DONE');
}

main().catch(err => { console.error('FATAL:', err.message); process.exit(1); });
