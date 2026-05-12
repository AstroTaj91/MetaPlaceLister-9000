import { chromium } from 'playwright';
import { getDecryptedCookies } from './session';

import fs from 'fs';
import path from 'path';

export async function publishToMarketplace(userId: string, listingData: { title: string; price: string; description: string; category: string; imageUrl?: string }) {
  // Retrieve and decrypt the Facebook session
  const cookies = await getDecryptedCookies(userId);
  
  console.log('Launching Playwright in headless mode...');
  const browser = await chromium.launch({ headless: true }); // Must be true for production server
  const context = await browser.newContext();
  
  // Sanitize cookies for Playwright's strict sameSite validation
  const sanitizedCookies = cookies.map((cookie: any) => {
    const validSameSite = ['Strict', 'Lax', 'None'];
    if (cookie.sameSite && !validSameSite.includes(cookie.sameSite)) {
      if (cookie.sameSite.toLowerCase() === 'no_restriction' || cookie.sameSite === 'unspecified') {
        cookie.sameSite = 'None';
      } else {
        delete cookie.sameSite; // Strip invalid attributes entirely
      }
    }
    return cookie;
  });

  // Inject the encrypted cookies to bypass login
  await context.addCookies(sanitizedCookies);

  const page = await context.newPage();
  
  try {
    console.log('Navigating to Facebook Marketplace...');
    await page.goto('https://www.facebook.com/marketplace/create/item', { waitUntil: 'networkidle' });

    // Wait for the main form to appear (the specific selector may change based on FB's DOM updates)
    // We will use standard ARIA locators where possible to be resilient.
    await page.waitForTimeout(3000); // Wait for potential redirects/react renders

    if (listingData.imageUrl) {
      console.log('Uploading image...');
      // Extract filename from the URL (e.g., http://localhost:3000/uploads/image.jpg -> image.jpg)
      const filename = listingData.imageUrl.split('/').pop();
      if (filename) {
        const localFilePath = path.join(__dirname, '../../uploads', filename);
        if (fs.existsSync(localFilePath)) {
          // FB uses an input[type="file"] for photo uploads. We can usually target it directly.
          // Note: The specific aria-label or selector for FB Marketplace's Add Photos button might vary, 
          // but an input type file is standard.
          const fileInput = page.locator('input[type="file"]');
          await fileInput.setInputFiles(localFilePath);
          await page.waitForTimeout(2000); // Wait for upload preview to render
        } else {
          console.log(`Local file not found for upload: ${localFilePath}`);
        }
      }
    }

    console.log('Entering Title...');
    await page.getByLabel('Title').fill(listingData.title);
    
    console.log('Entering Price...');
    await page.getByLabel('Price').fill(listingData.price);
    
    console.log('Entering Description...');
    // FB Marketplace description can sometimes be tricky with rich text.
    await page.getByLabel('Description').pressSequentially(listingData.description, { delay: 10 });
    
    console.log('Clicking the Publish button...');
    // We are now in production, so we actually click it!
    await page.getByRole('button', { name: 'Publish' }).click();

    // Wait for the publish action to complete (FB redirects or shows a success state)
    await page.waitForTimeout(5000);
    
    await browser.close();
    return { success: true, url: 'https://www.facebook.com/marketplace/item/pending' };
    
  } catch (error: any) {
    console.error('Playwright Error:', error);
    await browser.close();
    throw new Error('Failed to automate posting: ' + error.message);
  }
}
