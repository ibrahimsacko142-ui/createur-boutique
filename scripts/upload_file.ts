import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  const page = contexts[0].pages()[0];
  
  const fileInput = await page.locator('input[type=file]').first();
  await fileInput.setInputFiles('/home/z/my-project/upload/studio_cover.png');
  
  const files = await fileInput.evaluate(el => el.files.length);
  console.log('Files set:', files);
}

main().catch(console.error);
