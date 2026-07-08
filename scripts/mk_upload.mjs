import { chromium } from 'playwright';

const browser = await chromium.connectOverCDP('http://localhost:9222');
const context = browser.contexts()[0];
const page = context.pages()[0];

const fileInput = page.locator('input[type="file"]').first();
await fileInput.setInputFiles('/home/z/my-project/upload/studio_cover.png');

const count = await fileInput.evaluate(el => el.files.length);
console.log('Files after setInputFiles:', count);

await browser.close();
