// import puppeteer from 'puppeteer-extra';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// puppeteer.use(StealthPlugin());
// import fs from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import readline from 'readline';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Sleep function
// const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// async function manualLogin() {
//   console.log('🔑 Starting manual login process...');
  
//   const browser = await puppeteer.launch({
//     headless: false,
//     args: ['--no-sandbox', '--window-size=1366,768'],
//     defaultViewport: null
//   });
  
//   const page = await browser.newPage();
  
//   try {
//     // Go to IndiaMART login
//     await page.goto('https://seller.indiamart.com', { 
//       waitUntil: 'networkidle2',
//       timeout: 30000
//     });

//     console.log('\n📱 Please login manually in the browser window:');
//     console.log('1. Enter your mobile number');
//     console.log('2. Click "Send OTP"');
//     console.log('3. Enter the OTP you receive on your mobile');
//     console.log('4. Click "Login" or "Verify"');
//     console.log('5. Wait for the dashboard to fully load');
//     console.log('\n⚠️  IMPORTANT: Look for "Dashboard" or your company name in the top right.');
//     console.log('⚠️  Make sure you are on the seller dashboard page (URL should be seller.indiamart.com)\n');
    
//     await question('✅ Press ENTER after you have successfully logged in and see the dashboard...');
    
//     // Wait for dashboard to stabilize
//     await sleep(5000);
    
//     // DEBUG: Take a screenshot to see what's on the page
//     await page.screenshot({ path: 'debug-dashboard.png' });
//     console.log('📸 Screenshot saved as debug-dashboard.png');
    
//     // Try multiple selectors to detect login
//     const isLoggedIn = await page.evaluate(() => {
//       // Check for any of these indicators
//       const selectors = [
//         '.dashboard-container',
//         '.seller-dashboard',
//         '.header-user-details',
//         '.user-profile',
//         '.user-name',
//         '.logout-btn',
//         '.header-right .user-info',
//         '[class*="dashboard"]',
//         '[class*="user"]',
//         '[class*="profile"]'
//       ];
      
//       for (const selector of selectors) {
//         if (document.querySelector(selector)) {
//           return true;
//         }
//       }
      
//       // Check if URL indicates dashboard
//       if (window.location.href.includes('seller.indiamart.com') && 
//           !window.location.href.includes('login') &&
//           !window.location.href.includes('otp')) {
//         return true;
//       }
      
//       return false;
//     });
    
//     // Also check if there's a logout link
//     const hasLogout = await page.evaluate(() => {
//       const links = document.querySelectorAll('a');
//       for (const link of links) {
//         if (link.textContent && link.textContent.toLowerCase().includes('logout')) {
//           return true;
//         }
//       }
//       return false;
//     });
    
//     const finalCheck = isLoggedIn || hasLogout;
    
//     if (finalCheck) {
//       // Save cookies
//       const cookies = await page.cookies();
//       const cookiePath = path.join(__dirname, 'cookies.json');
//       await fs.writeFile(cookiePath, JSON.stringify(cookies, null, 2));
//       console.log('\n✅ Cookies saved successfully!');
//       console.log(`📁 Saved to: ${cookiePath}`);
//       console.log(`📊 Total cookies saved: ${cookies.length}`);
//       console.log('\n🎯 Your scraper will now use these cookies and skip OTP login.\n');
//     } else {
//       console.log('\n❌ Login not detected. Please try again.');
//       console.log('Make sure you are on the dashboard page.');
//       console.log('📸 Check debug-dashboard.png to see what the page looks like.');
      
//       // As a fallback, let user confirm manually
//       const manualConfirm = await question('🔧 Are you SURE you are logged in? (y/n): ');
//       if (manualConfirm.toLowerCase() === 'y') {
//         const cookies = await page.cookies();
//         const cookiePath = path.join(__dirname, 'cookies.json');
//         await fs.writeFile(cookiePath, JSON.stringify(cookies, null, 2));
//         console.log('\n✅ Cookies saved despite detection failure!');
//       }
//     }
    
//   } catch (error) {
//     console.error('❌ Error:', error.message);
//   } finally {
//     await browser.close();
//     rl.close();
//   }
// }

// manualLogin();

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function manualLogin() {
  console.log('🔑 Starting manual login process...');
  
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/usr/bin/google-chrome-stable', // <-- ADD THIS LINE
    args: ['--no-sandbox', '--window-size=1366,768'],
    defaultViewport: null
  });
  
  const page = await browser.newPage();
  
  try {
    // Go to IndiaMART login
    await page.goto('https://seller.indiamart.com', { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('\n📱 Please login manually in the browser window:');
    console.log('1. Enter your mobile number');
    console.log('2. Click "Send OTP"');
    console.log('3. Enter the OTP you receive on your mobile');
    console.log('4. Click "Login" or "Verify"');
    console.log('5. Wait for the dashboard to fully load');
    console.log('\n⚠️  IMPORTANT: Look for "Dashboard" or your company name in the top right.');
    console.log('⚠️  Make sure you are on the seller dashboard page (URL should be seller.indiamart.com)\n');
    
    await question('✅ Press ENTER after you have successfully logged in and see the dashboard...');
    
    // Wait for dashboard to stabilize
    await sleep(5000);
    
    // DEBUG: Take a screenshot to see what's on the page
    await page.screenshot({ path: 'debug-dashboard.png' });
    console.log('📸 Screenshot saved as debug-dashboard.png');
    
    // Try multiple selectors to detect login
    const isLoggedIn = await page.evaluate(() => {
      // Check for any of these indicators
      const selectors = [
        '.dashboard-container',
        '.seller-dashboard',
        '.header-user-details',
        '.user-profile',
        '.user-name',
        '.logout-btn',
        '.header-right .user-info',
        '[class*="dashboard"]',
        '[class*="user"]',
        '[class*="profile"]'
      ];
      
      for (const selector of selectors) {
        if (document.querySelector(selector)) {
          return true;
        }
      }
      
      // Check if URL indicates dashboard
      if (window.location.href.includes('seller.indiamart.com') && 
          !window.location.href.includes('login') &&
          !window.location.href.includes('otp')) {
        return true;
      }
      
      return false;
    });
    
    // Also check if there's a logout link
    const hasLogout = await page.evaluate(() => {
      const links = document.querySelectorAll('a');
      for (const link of links) {
        if (link.textContent && link.textContent.toLowerCase().includes('logout')) {
          return true;
        }
      }
      return false;
    });
    
    const finalCheck = isLoggedIn || hasLogout;
    
    if (finalCheck) {
      // Save cookies
      const cookies = await page.cookies();
      const cookiePath = path.join(__dirname, 'cookies.json');
      await fs.writeFile(cookiePath, JSON.stringify(cookies, null, 2));
      console.log('\n✅ Cookies saved successfully!');
      console.log(`📁 Saved to: ${cookiePath}`);
      console.log(`📊 Total cookies saved: ${cookies.length}`);
      console.log('\n🎯 Your scraper will now use these cookies and skip OTP login.\n');
    } else {
      console.log('\n❌ Login not detected. Please try again.');
      console.log('Make sure you are on the dashboard page.');
      console.log('📸 Check debug-dashboard.png to see what the page looks like.');
      
      // As a fallback, let user confirm manually
      const manualConfirm = await question('🔧 Are you SURE you are logged in? (y/n): ');
      if (manualConfirm.toLowerCase() === 'y') {
        const cookies = await page.cookies();
        const cookiePath = path.join(__dirname, 'cookies.json');
        await fs.writeFile(cookiePath, JSON.stringify(cookies, null, 2));
        console.log('\n✅ Cookies saved despite detection failure!');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
    rl.close();
  }
}

manualLogin();