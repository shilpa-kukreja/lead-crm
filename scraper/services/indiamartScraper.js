// import puppeteer from 'puppeteer-extra';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// puppeteer.use(StealthPlugin());
// import fs from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { filters } from '../config/filters.js';
// import { sendToCRM } from './crmService.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// class IndiaMartScraper {
//   constructor() {
//     this.browser = null;
//     this.page = null;
//     this.cookiePath = path.join(__dirname, '../cookies.json');
//     this.isLoggedIn = false;
//   }

//   async sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

//   async initialize() {
//     console.log('🔄 Initializing scraper...');
//     this.browser = await puppeteer.launch({
//       headless: false,
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-dev-shm-usage',
//         '--disable-accelerated-2d-canvas',
//         '--disable-gpu',
//         '--window-size=1366,768'
//       ],
//       defaultViewport: null
//     });
//     this.page = await this.browser.newPage();
//     await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
//     this.page.setDefaultTimeout(30000);
//   }

//   async loadCookies() {
//     try {
//       const cookieData = await fs.readFile(this.cookiePath, 'utf-8');
//       const cookies = JSON.parse(cookieData);
//       await this.page.setCookie(...cookies);
//       console.log(`✅ ${cookies.length} cookies loaded`);
//       return true;
//     } catch (error) {
//       console.log('📝 No cookies found, will login fresh');
//       return false;
//     }
//   }

//   async ensureLogin() {
//     console.log('🔑 Checking login status...');
    
//     // Try to load cookies
//     const hasCookies = await this.loadCookies();
    
//     if (hasCookies) {
//       // Go to dashboard with cookies
//       await this.page.goto('https://seller.indiamart.com', { 
//         waitUntil: 'networkidle2',
//         timeout: 30000
//       });
      
//       await this.sleep(3000);
      
//       // Check if we're logged in (multiple detection methods)
//       const isLoggedIn = await this.page.evaluate(() => {
//         // Method 1: Check for dashboard elements
//         const selectors = [
//           '.dashboard-container',
//           '.seller-dashboard',
//           '.header-user-details',
//           '.user-profile',
//           '.logout-btn',
//           '[class*="dashboard"]'
//         ];
        
//         for (const selector of selectors) {
//           if (document.querySelector(selector)) {
//             return true;
//           }
//         }
        
//         // Method 2: Check for logout link
//         const links = document.querySelectorAll('a');
//         for (const link of links) {
//           if (link.textContent && link.textContent.toLowerCase().includes('logout')) {
//             return true;
//           }
//         }
        
//         // Method 3: Check URL
//         if (window.location.href.includes('seller.indiamart.com') && 
//             !window.location.href.includes('login') &&
//             !window.location.href.includes('otp')) {
//           return true;
//         }
        
//         return false;
//       });
      
//       if (isLoggedIn) {
//         console.log('✅ Already logged in via cookies');
//         this.isLoggedIn = true;
//         return true;
//       } else {
//         console.log('⚠️ Cookies exist but session expired');
//       }
//     }
    
//     // If we get here, login failed - tell user to re-run manual login
//     console.log('❌ Not logged in. Please run: npm run login');
//     console.log('This will open a browser for you to log in manually with OTP.');
//     return false;
//   }

//   async applyFilters() {
//     console.log('🎯 Navigating to Buy Leads...');
//     try {
//       await this.page.goto('https://seller.indiamart.com/bltxn/?pref=relevant&D_L_B=1', { 
//         waitUntil: 'networkidle2',
//         timeout: 30000
//       });
      
//       await this.sleep(3000);
      
//       console.log('✅ On Buy Leads page');
//       return true;
//     } catch (error) {
//       console.error('⚠️ Navigation error:', error.message);
//       return false;
//     }
//   }

//   async scrapeLeads() {
//     console.log('📊 Scraping leads...');
//     try {
//       await this.sleep(3000);
      
//       // Try different selectors that might exist
//       const leads = await this.page.evaluate(() => {
//         // Try multiple possible selectors
//         const selectors = ['.lead-item', '.buy-lead-item', '.inquiry-item', '.lead-card', '.buy-lead'];
//         let items = [];
        
//         for (const selector of selectors) {
//           const found = document.querySelectorAll(selector);
//           if (found.length > 0) {
//             items = found;
//             break;
//           }
//         }
        
//         // If no leads found, try generic approach
//         if (items.length === 0) {
//           // Look for any card-like elements that might contain lead info
//           items = document.querySelectorAll('.card, .item, .listing-item');
//         }
        
//         console.log(`Found ${items.length} items on page`);
        
//         return Array.from(items).map(item => ({
//           indiamartId: item.dataset.leadId || item.dataset.inquiryId || 
//                        item.getAttribute('data-id') || 'unknown_' + Date.now() + '_' + Math.random(),
//           companyName: item.querySelector('.company, .company-name, .seller-name, .business-name')?.innerText?.trim() || '',
//           contactPerson: item.querySelector('.contact, .contact-person, .name')?.innerText?.trim() || '',
//           phone: item.querySelector('.phone, .mobile, .contact-number')?.innerText?.trim() || '',
//           email: item.querySelector('.email')?.innerText?.trim() || '',
//           productInterest: item.querySelector('.product, .requirement, .service, .category')?.innerText?.trim() || '',
//           message: item.querySelector('.message, .description, .note, .comment')?.innerText?.trim() || '',
//           budget: item.querySelector('.budget, .price, .amount')?.innerText?.trim() || '',
//           location: item.querySelector('.location, .city, .place')?.innerText?.trim() || '',
//           buyAvailable: !!item.querySelector('.buy-now, .buy-lead, .purchase, .buy-btn'),
//           buyButtonSelector: item.querySelector('.buy-now, .buy-lead, .purchase, .buy-btn') ? 
//             'button' : null
//         }));
//       });
      
//       // Filter leads
//       const filteredLeads = leads.filter(lead => {
//         if (lead.productInterest || lead.message || lead.companyName) {
//           return true;
//         }
//         return false;
//       });
      
//       console.log(`📈 Found ${leads.length} total items, ${filteredLeads.length} potential leads`);
//       return filteredLeads;
//     } catch (error) {
//       console.error('❌ Scraping error:', error.message);
//       return [];
//     }
//   }

//   async run() {
//     console.log('🚀 Starting scraper run...');
//     try {
//       await this.initialize();
      
//       // Check login
//       const loggedIn = await this.ensureLogin();
//       if (!loggedIn) {
//         console.log('❌ Cannot proceed without login. Run: npm run login');
//         await this.browser.close();
//         return;
//       }
      
//       // Navigate to buy leads
//       await this.applyFilters();
      
//       // Scrape leads
//       const leads = await this.scrapeLeads();
      
//       if (leads.length === 0) {
//         console.log('📭 No leads found');
//         await this.browser.close();
//         return;
//       }
      
//       // Process leads
//       const results = [];
//       const maxLeads = parseInt(process.env.MAX_LEADS_PER_RUN) || 10;
//       const leadsToProcess = leads.slice(0, maxLeads);
      
//       for (const lead of leadsToProcess) {
//         let bought = false;
        
//         // Try to buy if enabled
//         if (filters.autoBuyConditions.enabled) {
//           // Simple buy attempt (you may need to implement actual clicking)
//           console.log(`💼 Processing lead: ${lead.companyName || lead.productInterest || 'Unknown'}`);
//         }
        
//         // Send to CRM
//         const crmResult = await sendToCRM({
//           ...lead,
//           status: 'New'
//         });
        
//         results.push({ lead, bought, synced: crmResult.success });
//         await this.sleep(2000 + Math.random() * 3000);
//       }
      
//       console.log(`✅ Scraper run completed. Processed ${results.length} leads`);
//       console.log(`   Synced to CRM: ${results.filter(r => r.synced).length}`);
      
//       await this.browser.close();
//       return results;
//     } catch (error) {
//       console.error('❌ Scraper error:', error.message);
//       if (this.browser) await this.browser.close();
//       throw error;
//     }
//   }
// }

// export default IndiaMartScraper;

// import puppeteer from 'puppeteer-extra';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// puppeteer.use(StealthPlugin());
// import fs from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { filters } from '../config/filters.js';
// import { sendToCRM } from './crmService.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// class IndiaMartScraper {
//   constructor() {
//     this.browser = null;
//     this.page = null;
//     this.cookiePath = path.join(__dirname, '../cookies.json');
//     this.isLoggedIn = false;
//   }

//   async sleep(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

//   async initialize() {
//     console.log('🔄 Initializing scraper...');
//     this.browser = await puppeteer.launch({
//       headless: false,
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-dev-shm-usage',
//         '--disable-accelerated-2d-canvas',
//         '--disable-gpu',
//         '--window-size=1366,768'
//       ],
//       defaultViewport: null
//     });
//     this.page = await this.browser.newPage();
//     await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
//     this.page.setDefaultTimeout(30000);
//   }

//   async loadCookies() {
//     try {
//       const cookieData = await fs.readFile(this.cookiePath, 'utf-8');
//       const cookies = JSON.parse(cookieData);
//       await this.page.setCookie(...cookies);
//       console.log(`✅ ${cookies.length} cookies loaded`);
//       return true;
//     } catch (error) {
//       console.log('📝 No cookies found, will login fresh');
//       return false;
//     }
//   }

//   async ensureLogin() {
//     console.log('🔑 Checking login status...');
    
//     const hasCookies = await this.loadCookies();
    
//     if (hasCookies) {
//       await this.page.goto('https://seller.indiamart.com', { 
//         waitUntil: 'networkidle2',
//         timeout: 30000
//       });
      
//       await this.sleep(3000);
      
//       const isLoggedIn = await this.page.evaluate(() => {
//         // Check for various dashboard indicators
//         const selectors = [
//           '.dashboard-container',
//           '.seller-dashboard',
//           '.header-user-details',
//           '.user-profile',
//           '.logout-btn',
//           '[class*="dashboard"]'
//         ];
        
//         for (const selector of selectors) {
//           if (document.querySelector(selector)) {
//             return true;
//           }
//         }
        
//         // Check for logout link
// const links = document.querySelectorAll('a');
//         for (const link of links) {
//           if (link.textContent && link.textContent.toLowerCase().includes('logout')) {
//             return true;
//           }
//         }
        
//         return false;
//       });
      
//       if (isLoggedIn) {
//         console.log('✅ Already logged in via cookies');
//         this.isLoggedIn = true;
//         return true;
//       } else {
//         console.log('⚠️ Cookies exist but session expired');
//       }
//     }
    
//     console.log('❌ Not logged in. Please run: npm run login');
//     return false;
//   }

//   async navigateToBuyLeads() {
//     console.log('🎯 Navigating to Buy Leads...');
//     try {
//       // Use the exact URL from your screenshot
//       await this.page.goto('https://seller.indiamart.com/bltxn/?pref=relevant&D_L_B=1', { 
//         waitUntil: 'networkidle2',
//         timeout: 30000
//       });
      
//       await this.sleep(5000);
//       console.log('✅ On Buy Leads page');
//       return true;
//     } catch (error) {
//       console.error('⚠️ Navigation error:', error.message);
//       return false;
//     }
//   }

//   async scrapeLeads() {
//     console.log('📊 Scraping leads...');
//     try {
//       // Wait for leads to load
//       await this.sleep(3000);
      
//       // Take screenshot for debugging
//       await this.page.screenshot({ path: 'debug-leads-page.png' });
//       console.log('📸 Debug screenshot saved: debug-leads-page.png');
      
//       // Extract lead data based on the actual structure from screenshot
//       const leads = await this.page.evaluate(() => {
//         // Try to find lead cards - based on screenshot, they might have these classes
//         const leadSelectors = [
//           '.lead-item',
//           '.buy-lead-item', 
//           '.lead-card',
//           '.bl-card',
//           '.card',
//           '[class*="lead"]',
//           '[class*="card"]',
//           '.item'
//         ];
        
//         let items = [];
//         for (const selector of leadSelectors) {
//           const found = document.querySelectorAll(selector);
//           if (found.length > 0) {
//             console.log(`Found ${found.length} items with selector: ${selector}`);
//             items = found;
//             break;
//           }
//         }
        
//         // If still no items, try looking for containers with lead-like content
//         if (items.length === 0) {
//           // Look for elements containing "Contact Buyer Now" or "Shortlist"
//           const allDivs = document.querySelectorAll('div');
//           for (const div of allDivs) {
//             const text = div.textContent || '';
//             if (text.includes('Contact Buyer Now') || text.includes('Shortlist')) {
//               // Find the parent container
//               let parent = div;
//               for (let i = 0; i < 5; i++) {
//                 if (parent.parentElement) {
//                   parent = parent.parentElement;
//                 }
//               }
//               if (!items.includes(parent)) {
//                 items.push(parent);
//               }
//             }
//           }
//           console.log(`Found ${items.length} items by searching for "Contact Buyer Now"`);
//         }
        
//         console.log(`Total items found: ${items.length}`);
        
//         return Array.from(items).map(item => {
//           // Extract text content for analysis
//           const fullText = item.textContent || '';
          
//           // Try to find title
//           const titleSelectors = ['h3', 'h2', '.title', '.heading', '.req-title', '[class*="title"]', '.name'];
//           let title = '';
//           for (const sel of titleSelectors) {
//             const el = item.querySelector(sel);
//             if (el) {
//               title = el.textContent.trim();
//               break;
//             }
//           }
//           if (!title) {
//             // Try to get first strong/highlighted text
//             const strong = item.querySelector('strong, b, .highlight');
//             if (strong) title = strong.textContent.trim();
//           }
          
//           // Try to find location
//           const locationSelectors = ['.location', '.city', '.place', '[class*="location"]', '.address'];
//           let location = '';
//           for (const sel of locationSelectors) {
//             const el = item.querySelector(sel);
//             if (el) {
//               location = el.textContent.trim();
//               break;
//             }
//           }
//           if (!location) {
//             // Try to find text with city names (simplified)
//             const textParts = fullText.split('\n');
//             for (const part of textParts) {
//               if (part.includes(',')) {
//                 const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Indore', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Nagpur', 'Bhopal'];
//                 for (const city of cities) {
//                   if (part.includes(city)) {
//                     location = part.trim();
//                     break;
//                   }
//                 }
//                 if (location) break;
//               }
//             }
//           }
          
//           // Try to find category
//           const categorySelectors = ['.category', '.service', '.product-category', '[class*="category"]'];
//           let category = '';
//           for (const sel of categorySelectors) {
//             const el = item.querySelector(sel);
//             if (el) {
//               category = el.textContent.trim();
//               break;
//             }
//           }
//           if (!category) {
//             // Try to find text with ">" which indicates category hierarchy
//             const textParts = fullText.split('\n');
//             for (const part of textParts) {
//               if (part.includes('>') && part.trim().length < 100) {
//                 category = part.trim();
//                 break;
//               }
//             }
//           }
          
//           // Try to find requirement type
//           let requirementType = '';
//           const reqMatch = fullText.match(/Requirement Type[:\s]+([^\n]+)/i);
//           if (reqMatch) requirementType = reqMatch[1].trim();
          
//           // Try to find description
//           const descSelectors = ['.description', '.message', '.detail', '.note', '[class*="desc"]'];
//           let description = '';
//           for (const sel of descSelectors) {
//             const el = item.querySelector(sel);
//             if (el) {
//               description = el.textContent.trim();
//               break;
//             }
//           }
//           if (!description) {
//             // Get first paragraph or long text
//             const paragraphs = item.querySelectorAll('p');
//             for (const p of paragraphs) {
//               if (p.textContent.length > 20) {
//                 description = p.textContent.trim();
//                 break;
//               }
//             }
//           }
          
//           // Find Contact Buyer Now button
//           const buyButton = item.querySelector('[class*="contact"], [class*="buy"], [class*="purchase"], .btn-primary, button:contains("Contact")');
//           const buyAvailable = !!buyButton || fullText.includes('Contact Buyer Now');
          
//           // Find date
//           let date = '';
//           const dateMatch = fullText.match(/(Yesterday|Today|Tomorrow|\d+\s+(?:hours?|days?|weeks?))/i);
//           if (dateMatch) date = dateMatch[1];
          
//           // Extract indiamartId from URL or data attribute
//           let indiamartId = item.dataset.leadId || item.dataset.inquiryId || 
//                            item.getAttribute('data-id') || item.getAttribute('data-lead-id') ||
//                            'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
          
//           // Try to get ID from links
//           const links = item.querySelectorAll('a');
//           for (const link of links) {
//             const href = link.getAttribute('href');
//             if (href && (href.includes('lead') || href.includes('inquiry'))) {
//               const idMatch = href.match(/[\/\?]id[=\/]([^&\/]+)/i);
//               if (idMatch) {
//                 indiamartId = idMatch[1];
//                 break;
//               }
//             }
//           }
          
//           return {
//             indiamartId: indiamartId,
//             title: title || 'Unknown Lead',
//             companyName: title || '',
//             contactPerson: '', // Not always available
//             phone: '', // Not always available
//             email: '', // Not always available
//             productInterest: category || '',
//             message: description || fullText.substring(0, 200),
//             budget: '',
//             location: location || '',
//             date: date || '',
//             requirementType: requirementType || '',
//             buyAvailable: buyAvailable,
//             fullText: fullText
//           };
//         });
//       });
      
//       // Filter leads with actual content
//       const filteredLeads = leads.filter(lead => {
//         // Must have at least a title or description
//         if (lead.title && lead.title !== 'Unknown Lead') return true;
//         if (lead.message && lead.message.length > 10) return true;
//         if (lead.productInterest) return true;
//         return false;
//       });
      
//       console.log(`📈 Found ${leads.length} total items, ${filteredLeads.length} potential leads`);
      
//       // Log first lead for debugging
//       if (filteredLeads.length > 0) {
//         console.log('📋 Sample lead:', JSON.stringify(filteredLeads[0], null, 2));
//       }
      
//       return filteredLeads;
//     } catch (error) {
//       console.error('❌ Scraping error:', error.message);
//       return [];
//     }
//   }

//   async buyLead(lead) {
//     if (!lead.buyAvailable) {
//       console.log(`⏭️ Skipping lead - no buy button available`);
//       return false;
//     }
    
//     console.log(`💰 Attempting to buy lead: ${lead.title}`);
    
//     try {
//       // Try to find and click the "Contact Buyer Now" button
//       const buyButton = await this.page.evaluate(() => {
//         // Look for Contact Buyer Now button
//         const buttons = document.querySelectorAll('button, a, .btn, [role="button"]');
//         for (const btn of buttons) {
//           const text = btn.textContent || '';
//           if (text.includes('Contact Buyer Now') || 
//               text.includes('Contact') && text.includes('Buyer') ||
//               text.includes('Buy Now') ||
//               text.includes('Purchase')) {
//             return btn;
//           }
//         }
//         return null;
//       });
      
//       if (!buyButton) {
//         console.log('❌ Buy button not found on page');
//         return false;
//       }
      
//       // Click the button
//       await this.page.evaluate((btn) => {
//         btn.click();
//       }, buyButton);
      
//       await this.sleep(3000);
      
//       // Check for confirmation or success
//       const success = await this.page.evaluate(() => {
//         const body = document.body.textContent || '';
//         return body.includes('Success') || 
//                body.includes('Contacted') || 
//                body.includes('Purchased') ||
//                body.includes('Lead bought');
//       });
      
//       if (success) {
//         console.log(`✅ Successfully bought lead: ${lead.title}`);
//         return true;
//       } else {
//         console.log(`⚠️ Lead purchase may have failed: ${lead.title}`);
//         return false;
//       }
//     } catch (error) {
//       console.error(`❌ Failed to buy lead ${lead.title}:`, error.message);
//       return false;
//     }
//   }

//   async run() {
//     console.log('🚀 Starting scraper run...');
//     try {
//       await this.initialize();
      
//       // Check login
//       const loggedIn = await this.ensureLogin();
//       if (!loggedIn) {
//         console.log('❌ Cannot proceed without login. Run: npm run login');
//         await this.browser.close();
//         return;
//       }
      
//       // Navigate to buy leads
//       await this.navigateToBuyLeads();
      
//       // Scrape leads
//       const leads = await this.scrapeLeads();
      
//       if (leads.length === 0) {
//         console.log('📭 No leads found on page');
//         await this.browser.close();
//         return;
//       }
      
//       // Process leads
//       const results = [];
//       const maxLeads = parseInt(process.env.MAX_LEADS_PER_RUN) || 5;
//       const leadsToProcess = leads.slice(0, maxLeads);
      
//       for (const lead of leadsToProcess) {
//         let bought = false;
        
//         // Try to buy if enabled
//         if (filters.autoBuyConditions && filters.autoBuyConditions.enabled) {
//           // Check if lead matches keywords
//           const leadText = `${lead.title} ${lead.productInterest} ${lead.message}`.toLowerCase();
//           const hasKeyword = filters.keywords.some(keyword => 
//             leadText.includes(keyword.toLowerCase())
//           );
          
//           if (hasKeyword || !filters.autoBuyConditions.requireKeywordMatch) {
//             console.log(`💼 Processing lead: ${lead.title}`);
//             bought = await this.buyLead(lead);
//           } else {
//             console.log(`⏭️ Skipping lead (no keyword match): ${lead.title}`);
//           }
//         }
        
//         // Send to CRM
//         const crmResult = await sendToCRM({
//           indiamartId: lead.indiamartId,
//           companyName: lead.title || lead.companyName || '',
//           contactPerson: lead.contactPerson || '',
//           phone: lead.phone || '',
//           email: lead.email || '',
//           productInterest: lead.productInterest || '',
//           message: lead.message || '',
//           location: lead.location || '',
//           status: bought ? 'Contacted' : 'New'
//         });
        
//         results.push({ lead, bought, synced: crmResult.success });
//         await this.sleep(3000);
//       }
      
//       console.log(`✅ Scraper run completed. Processed ${results.length} leads`);
//       console.log(`   Bought: ${results.filter(r => r.bought).length}`);
//       console.log(`   Synced to CRM: ${results.filter(r => r.synced).length}`);
      
//       await this.browser.close();
//       return results;
//     } catch (error) {
//       console.error('❌ Scraper error:', error.message);
//       if (this.browser) await this.browser.close();
//       throw error;
//     }
//   }
// }

// export default IndiaMartScraper;
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { filters } from '../config/filters.js';
import { sendToCRM } from './crmService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class IndiaMartScraper {
  constructor() {
    this.browser = null;
    this.page = null;
    this.cookiePath = path.join(__dirname, '../cookies.json');
    this.isLoggedIn = false;
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async initialize() {
    console.log('🔄 Initializing scraper...');
    this.browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1366,768'
      ],
      defaultViewport: null
    });
    this.page = await this.browser.newPage();
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    this.page.setDefaultTimeout(30000);
  }

  async loadCookies() {
    try {
      const cookieData = await fs.readFile(this.cookiePath, 'utf-8');
      const cookies = JSON.parse(cookieData);
      await this.page.setCookie(...cookies);
      console.log(`✅ ${cookies.length} cookies loaded`);
      return true;
    } catch (error) {
      console.log('📝 No cookies found, will login fresh');
      return false;
    }
  }

  async checkIfLoggedIn() {
    console.log('🔍 Checking if logged in...');
    
    // Check multiple ways
    const isLoggedIn = await this.page.evaluate(() => {
      // 1. Check for dashboard elements
      const selectors = [
        '.dashboard-container',
        '.seller-dashboard',
        '.header-user-details',
        '.user-profile',
        '.logout-btn',
        '.user-name',
        '.header-right .user-info',
        '[class*="dashboard"]',
        '.nav-user',
        '.profile-menu',
        '.user-avatar'
      ];
      
      for (const selector of selectors) {
        if (document.querySelector(selector)) {
          return true;
        }
      }
      
      // 2. Check for logout link
      const links = document.querySelectorAll('a, button, span');
      for (const el of links) {
        const text = (el.textContent || '').toLowerCase();
        if (text.includes('logout') || text.includes('sign out')) {
          return true;
        }
      }
      
      // 3. Check if URL is dashboard (not login/OTP)
      const url = window.location.href;
      if (url.includes('seller.indiamart.com') && 
          !url.includes('login') && 
          !url.includes('otp') &&
          !url.includes('signin')) {
        return true;
      }
      
      // 4. Check for company/business name in header
      const headerText = document.querySelector('header, .header, .top-bar, .navbar')?.textContent || '';
      if (headerText && (headerText.includes('Dashboard') || 
                         headerText.includes('Profile') || 
                         headerText.includes('Lead Manager'))) {
        return true;
      }
      
      return false;
    });
    
    if (isLoggedIn) {
      console.log('✅ Login detected successfully');
      return true;
    } else {
      console.log('❌ Not logged in or login not detected');
      return false;
    }
  }

  async ensureLogin() {
    console.log('🔑 Checking login status...');
    
    const hasCookies = await this.loadCookies();
    
    if (hasCookies) {
      // Navigate to the actual dashboard URL (not just the root)
      console.log('🌐 Navigating to dashboard...');
      await this.page.goto('https://seller.indiamart.com', { 
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      await this.sleep(5000);
      
      // Take screenshot for debugging
      await this.page.screenshot({ path: 'debug-login-check.png' });
      console.log('📸 Debug screenshot saved: debug-login-check.png');
      
      // Check if we're logged in
      const loggedIn = await this.checkIfLoggedIn();
      
      if (loggedIn) {
        console.log('✅ Already logged in via cookies');
        this.isLoggedIn = true;
        return true;
      } else {
        console.log('⚠️ Cookies exist but session expired or login not detected');
        console.log('💡 Trying to navigate to buy leads page directly...');
        
        // Try going directly to buy leads - sometimes this works even if dashboard check fails
        await this.page.goto('https://seller.indiamart.com/bltxn/?pref=relevant&D_L_B=1', { 
          waitUntil: 'networkidle2',
          timeout: 30000
        });
        
        await this.sleep(3000);
        
        // Check if we can see buy leads content
        const hasContent = await this.page.evaluate(() => {
          const body = document.body.textContent || '';
          return body.includes('BuyLeads') || 
                 body.includes('Contact Buyer Now') ||
                 body.includes('Shortlist') ||
                 body.length > 1000;
        });
        
        if (hasContent) {
          console.log('✅ Successfully loaded buy leads page (session is active)');
          this.isLoggedIn = true;
          return true;
        }
        
        console.log('❌ Session appears to be expired');
      }
    }
    
    console.log('❌ Not logged in. Please run: npm run login');
    console.log('   This will open a browser for you to log in manually with OTP.');
    console.log('   After saving cookies, run npm run dev again.');
    return false;
  }

  async navigateToBuyLeads() {
    console.log('🎯 Navigating to Buy Leads...');
    try {
      await this.page.goto('https://seller.indiamart.com/bltxn/?pref=relevant&D_L_B=1', { 
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      await this.sleep(5000);
      
      // Check if we're actually on the buy leads page
      const pageTitle = await this.page.title();
      console.log(`📄 Page title: ${pageTitle}`);
      
      const hasContent = await this.page.evaluate(() => {
        const body = document.body.textContent || '';
        return body.includes('BuyLeads') || 
               body.includes('Contact Buyer Now') ||
               body.includes('Shortlist') ||
               body.includes('No relevant BuyLeads') ||
               body.length > 500;
      });
      
      if (hasContent) {
        console.log('✅ Successfully loaded Buy Leads page');
        return true;
      } else {
        console.log('⚠️ Buy Leads page may not have loaded properly');
        return false;
      }
    } catch (error) {
      console.error('⚠️ Navigation error:', error.message);
      return false;
    }
  }

  // async scrapeLeads() {
  //   console.log('📊 Scraping leads...');
  //   try {
  //     await this.sleep(3000);
      
  //     // Take screenshot for debugging
  //     await this.page.screenshot({ path: 'debug-leads-page.png' });
  //     console.log('📸 Debug screenshot saved: debug-leads-page.png');
      
  //     // First, check if there are any leads on the page
  //     const pageText = await this.page.evaluate(() => document.body.textContent || '');
      
  //     if (pageText.includes('No relevant BuyLeads found')) {
  //       console.log('📭 No relevant BuyLeads found - showing other leads');
  //     }
      
  //     // Extract lead data
  //     const leads = await this.page.evaluate(() => {
  //       const results = [];
        
  //       // Try to find lead containers
  //       // Based on screenshot, leads might be in cards or list items
  //       const possibleContainers = document.querySelectorAll(
  //         '.lead-item, .buy-lead-item, .lead-card, .bl-card, ' +
  //         '.item, .card, [class*="lead"], [class*="inquiry"], ' +
  //         '.listing-item, .requirement-item'
  //       );
        
  //       console.log(`Found ${possibleContainers.length} potential lead containers`);
        
  //       // If no containers found, try a different approach - look for "Contact Buyer Now" sections
  //       let containers = Array.from(possibleContainers);
        
  //       if (containers.length === 0) {
  //         // Look for any div containing "Contact Buyer Now"
  //         const allDivs = document.querySelectorAll('div');
  //         for (const div of allDivs) {
  //           const text = div.textContent || '';
  //           if (text.includes('Contact Buyer Now') || text.includes('Shortlist')) {
  //             // Find the parent container
  //             let parent = div;
  //             for (let i = 0; i < 5; i++) {
  //               if (parent.parentElement) {
  //                 parent = parent.parentElement;
  //               }
  //             }
  //             if (!containers.includes(parent)) {
  //               containers.push(parent);
  //             }
  //           }
  //         }
  //         console.log(`Found ${containers.length} containers by searching for "Contact Buyer Now"`);
  //       }
        
  //       // Process each container
  //       for (const container of containers) {
  //         const text = container.textContent || '';
          
  //         // Skip if too short or just navigation
  //         if (text.length < 20) continue;
  //         if (text.includes('Navigation') || text.includes('Sidebar')) continue;
          
  //         // Extract title
  //         let title = '';
  //         const titleElements = container.querySelectorAll('h2, h3, h4, strong, b, .title, .heading, .req-title');
  //         for (const el of titleElements) {
  //           const t = el.textContent.trim();
  //           if (t.length > 5 && t.length < 200) {
  //             title = t;
  //             break;
  //           }
  //         }
  //         if (!title) {
  //           // Try to get first line
  //           const lines = text.split('\n').filter(line => line.trim().length > 10);
  //           if (lines.length > 0) title = lines[0].trim();
  //         }
          
  //         // Extract location
  //         let location = '';
  //         const locationMatch = text.match(/([A-Za-z\s]+,\s*[A-Za-z\s]+)/);
  //         if (locationMatch && locationMatch[1].length < 50) {
  //           location = locationMatch[1].trim();
  //         }
          
  //         // Check for city names
  //         const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Indore', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Nagpur', 'Bhopal', 'Patna', 'Vadodara', 'Coimbatore', 'Visakhapatnam'];
  //         for (const city of cities) {
  //           if (text.includes(city)) {
  //             location = city;
  //             break;
  //           }
  //         }
          
  //         // Extract category
  //         let category = '';
  //         const categoryMatch = text.match(/([A-Za-z\s]+)Services?/i);
  //         if (categoryMatch) category = categoryMatch[1].trim() + 'Services';
          
  //         // Extract requirement type
  //         let requirementType = '';
  //         const reqMatch = text.match(/Requirement Type[:\s]+([^\n]+)/i);
  //         if (reqMatch) requirementType = reqMatch[1].trim();
          
  //         // Check for buy button
  //         const hasBuyButton = text.includes('Contact Buyer Now') || 
  //                              text.includes('Buy Now') || 
  //                              text.includes('Purchase') ||
  //                              container.querySelector('[class*="contact"]') !== null;
          
  //         // Generate ID
  //         const id = container.dataset.leadId || 
  //                    container.dataset.inquiryId || 
  //                    container.getAttribute('data-id') ||
  //                    'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
          
  //         // Extract description
  //         let description = '';
  //         const descMatch = text.match(/([^\n]{50,200})/);
  //         if (descMatch) description = descMatch[1].trim();
          
  //         results.push({
  //           indiamartId: id,
  //           title: title || 'Unknown Lead',
  //           companyName: title || '',
  //           contactPerson: '',
  //           phone: '',
  //           email: '',
  //           productInterest: category || '',
  //           message: description || text.substring(0, 300),
  //           budget: '',
  //           location: location || '',
  //           requirementType: requirementType || '',
  //           buyAvailable: hasBuyButton,
  //           fullText: text.substring(0, 500)
  //         });
  //       }
        
  //       return results;
  //     });
      
  //     // Filter out duplicates and empty leads
  //     const uniqueLeads = [];
  //     const seenIds = new Set();
      
  //     for (const lead of leads) {
  //       // Skip if no meaningful content
  //       if (!lead.title && !lead.message && !lead.productInterest) continue;
  //       if (lead.title === 'Unknown Lead' && !lead.message) continue;
        
  //       // Deduplicate by ID
  //       if (lead.indiamartId && !seenIds.has(lead.indiamartId)) {
  //         seenIds.add(lead.indiamartId);
  //         uniqueLeads.push(lead);
  //       }
  //     }
      
  //     console.log(`📈 Found ${uniqueLeads.length} unique leads`);
      
  //     if (uniqueLeads.length > 0) {
  //       console.log('📋 Sample lead:', JSON.stringify(uniqueLeads[0], null, 2).substring(0, 300));
  //     }
      
  //     return uniqueLeads;
  //   } catch (error) {
  //     console.error('❌ Scraping error:', error.message);
  //     return [];
  //   }
  // }

// async scrapeLeads() {
//   console.log('📊 Scraping leads...');
//   try {
//     await this.sleep(3000);
    
//     // Take screenshot for debugging
//     await this.page.screenshot({ path: 'debug-leads-page.png' });
//     console.log('📸 Debug screenshot saved: debug-leads-page.png');
    
//     // Extract REAL leads only - skip navigation elements
//     const leads = await this.page.evaluate(() => {
//       const results = [];
      
//       // Find the main content area
//       const mainContent = document.querySelector('main, .main-content, .content-area, [class*="content"]');
//       if (!mainContent) {
//         console.log('No main content area found');
//         return results;
//       }
      
//       // Get all divs within main content that have substantial text
//       const allDivs = mainContent.querySelectorAll('div');
      
//       // Filter to find lead cards
//       for (const div of allDivs) {
//         const text = div.textContent || '';
        
//         // Skip if too short or navigation
//         if (text.length < 50) continue;
//         if (text.includes('Navigation') || text.includes('Sidebar')) continue;
//         if (text.includes('Dashboard') && text.length < 100) continue;
//         if (text.includes('Profile') && text.length < 100) continue;
//         if (text.includes('Products') && text.length < 100) continue;
        
//         // Check if this div contains a heading
//         const heading = div.querySelector('h1, h2, h3, h4, strong, b, .title, .heading');
//         if (!heading) continue;
        
//         const headingText = heading.textContent.trim();
//         // Skip generic navigation-like headings
//         if (['Dashboard', 'Profile', 'Lead Manager', 'Products', 'Settings', 'Help'].includes(headingText)) {
//           continue;
//         }
//         if (headingText.length < 3) continue;
        
//         // Check if it has a date or location indicator
//         const hasDate = text.match(/(Yesterday|Today|Tomorrow|\d+\s+(?:hours?|days?|weeks?|months?))/i) !== null;
//         const hasLocation = text.match(/([A-Za-z\s]+,\s*[A-Za-z\s]+)/) !== null || 
//                            text.includes('Indore') || text.includes('Mumbai') || text.includes('Delhi');
//         if (!hasDate && !hasLocation) continue;
        
//         // Check for buy button or "Contact Buyer Now" text
//         const hasBuyButton = text.includes('Contact Buyer Now') || 
//                              text.includes('Shortlist') || 
//                              text.includes('View Similar');
//         if (!hasBuyButton) continue;
        
//         // --- This is likely a real lead card ---
        
//         // Extract title (heading text)
//         let title = headingText;
        
//         // Extract location
//         let location = '';
//         const locMatch = text.match(/([A-Za-z\s]+,\s*[A-Za-z\s]+)/);
//         if (locMatch) location = locMatch[1].trim();
//         if (!location) {
//           const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Indore', 
//                          'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Nagpur', 'Bhopal', 'Patna', 'Vadodara', 
//                          'Coimbatore', 'Visakhapatnam'];
//           for (const city of cities) {
//             if (text.includes(city)) {
//               location = city;
//               break;
//             }
//           }
//         }
        
//         // Extract category
//         let category = '';
//         const catMatch = text.match(/([A-Za-z\s]+Services?)/i);
//         if (catMatch) category = catMatch[1].trim();
//         if (!category) {
//           const lines = text.split('\n');
//           for (const line of lines) {
//             if (line.includes('>') && line.length < 100) {
//               category = line.trim();
//               break;
//             }
//           }
//         }
        
//         // Extract requirement type
//         let requirementType = '';
//         const reqMatch = text.match(/Requirement Type[:\s]+([^\n]+)/i);
//         if (reqMatch) requirementType = reqMatch[1].trim();
        
//         // Extract buyer info
//         let buyerInfo = '';
//         const buyerMatch = text.match(/Buyer since\s+([^\n]+)/i);
//         if (buyerMatch) buyerInfo = buyerMatch[1].trim();
        
//         // Extract date
//         let date = '';
//         const dateMatch = text.match(/(Yesterday|Today|Tomorrow|\d+\s+(?:hours?|days?|weeks?|months?))/i);
//         if (dateMatch) date = dateMatch[1];
        
//         // Extract description
//         let description = '';
//         const descMatch = text.match(/([A-Za-z0-9\s,\.\-]{50,300})/);
//         if (descMatch) description = descMatch[1].trim();
        
//         // Generate ID
//         const id = div.dataset.leadId || 
//                    div.dataset.inquiryId || 
//                    div.getAttribute('data-id') ||
//                    'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        
//         results.push({
//           indiamartId: id,
//           title: title || 'Lead',
//           companyName: title || '',
//           contactPerson: '',
//           phone: '',
//           email: '',
//           productInterest: category || '',
//           message: description || text.substring(0, 300),
//           budget: '',
//           location: location || '',
//           requirementType: requirementType || '',
//           buyerInfo: buyerInfo || '',
//           date: date || '',
//           buyAvailable: true,
//           fullText: text.substring(0, 500)
//         });
//       }
      
//       return results;
//     });
    
//     // Filter unique leads
//     const uniqueLeads = [];
//     const seenTitles = new Set();
//     for (const lead of leads) {
//       if (!lead.title && !lead.message && !lead.productInterest) continue;
//       const key = lead.title + lead.location;
//       if (seenTitles.has(key)) continue;
//       seenTitles.add(key);
//       uniqueLeads.push(lead);
//     }
    
//     console.log(`📈 Found ${leads.length} raw containers, ${uniqueLeads.length} unique leads`);
    
//     if (uniqueLeads.length > 0) {
//       console.log('📋 Sample lead:');
//       console.log(`   Title: ${uniqueLeads[0].title}`);
//       console.log(`   Location: ${uniqueLeads[0].location || 'N/A'}`);
//       console.log(`   Category: ${uniqueLeads[0].productInterest || 'N/A'}`);
//       console.log(`   Message snippet: ${(uniqueLeads[0].message || '').substring(0, 50)}...`);
//     }
    
//     return uniqueLeads;
//   } catch (error) {
//     console.error('❌ Scraping error:', error.message);
//     return [];
//   }
// }


async scrapeLeads() {
  console.log('📊 Scraping leads...');
  try {
    await this.sleep(3000);
    
    // Take screenshot for debugging
    await this.page.screenshot({ path: 'debug-leads-page.png' });
    console.log('📸 Debug screenshot saved: debug-leads-page.png');
    
    // ---- HYBRID EXTRACTION STRATEGY ----
    const leads = await this.page.evaluate(() => {
      const results = [];
      
      // ----- STRATEGY A: Look for any container that has a heading and contains "Contact Buyer Now" -----
      const allDivs = document.querySelectorAll('div, section, article, li');
      let containers = [];
      
      for (const el of allDivs) {
        const text = el.textContent || '';
        // Must have "Contact Buyer Now" or similar
        if (!text.includes('Contact Buyer Now') && !text.includes('Shortlist')) continue;
        // Must have a heading or strong text
        const heading = el.querySelector('h1, h2, h3, h4, strong, b, .title, .heading');
        if (!heading) continue;
        // Heading text must be at least 3 chars and not generic navigation
        const headingText = heading.textContent.trim();
        if (headingText.length < 3) continue;
        if (['Dashboard', 'Profile', 'Lead Manager', 'Products', 'Settings', 'Help'].includes(headingText)) continue;
        // This is a candidate
        containers.push(el);
      }
      
      console.log(`Strategy A: Found ${containers.length} containers with heading + "Contact Buyer Now"`);
      
      // ----- STRATEGY B: If none found, find the parent container of any element with "Contact Buyer Now" -----
      if (containers.length === 0) {
        const buyElements = [];
        const allEls = document.querySelectorAll('*');
        for (const el of allEls) {
          if (el.textContent.includes('Contact Buyer Now')) {
            buyElements.push(el);
          }
        }
        for (const buyEl of buyElements) {
          let parent = buyEl.parentElement;
          for (let i = 0; i < 6; i++) {
            if (!parent) break;
            const text = parent.textContent || '';
            if (text.length > 100 && parent.querySelector('h1, h2, h3, h4, strong, b')) {
              if (!containers.includes(parent)) {
                containers.push(parent);
              }
              break;
            }
            parent = parent.parentElement;
          }
        }
        console.log(`Strategy B: Found ${containers.length} containers by climbing up from buy buttons`);
      }
      
      // ----- STRATEGY C: Fallback – find any element with a heading and location-like text -----
      if (containers.length === 0) {
        for (const el of allDivs) {
          const text = el.textContent || '';
          if (text.length < 50) continue;
          // Must have a heading
          const heading = el.querySelector('h1, h2, h3, h4, strong, b, .title');
          if (!heading) continue;
          const headingText = heading.textContent.trim();
          if (headingText.length < 3) continue;
          // Check for location pattern (City, State) or known city names
          const hasLocation = text.match(/([A-Za-z\s]+,\s*[A-Za-z\s]+)/) !== null ||
                              text.includes('Indore') || text.includes('Mumbai') || text.includes('Delhi');
          if (!hasLocation) continue;
          // Check for date or "Requirement Type"
          const hasDate = text.match(/(Yesterday|Today|\d+\s+(?:hours?|days?|weeks?))/i) !== null;
          const hasReqType = text.includes('Requirement Type');
          if (!hasDate && !hasReqType) continue;
          containers.push(el);
        }
        console.log(`Strategy C: Found ${containers.length} containers by heading + location + date/requirement`);
      }
      
      // ----- Process containers -----
      for (const container of containers) {
        const text = container.textContent || '';
        if (text.length < 30) continue;
        
        // Extract title
        let title = '';
        const titleEl = container.querySelector('h1, h2, h3, h4, strong, b, .title, .heading, .req-title');
        if (titleEl) {
          title = titleEl.textContent.trim();
        }
        if (!title) {
          const lines = text.split('\n').filter(line => line.trim().length > 5);
          if (lines.length > 0) title = lines[0].trim();
        }
        
        // Extract location
        let location = '';
        const locEl = container.querySelector('.location, .city, .place, [class*="location"], [class*="city"]');
        if (locEl) location = locEl.textContent.trim();
        if (!location) {
          const locMatch = text.match(/([A-Za-z\s]+,\s*[A-Za-z\s]+)/);
          if (locMatch) location = locMatch[1].trim();
        }
        if (!location) {
          const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Indore', 
                         'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Nagpur', 'Bhopal', 'Patna', 'Vadodara'];
          for (const city of cities) {
            if (text.includes(city)) {
              location = city;
              break;
            }
          }
        }
        
        // Category
        let category = '';
        const catMatch = text.match(/([A-Za-z\s]+Services?)/i);
        if (catMatch) category = catMatch[1].trim();
        if (!category) {
          const lines = text.split('\n');
          for (const line of lines) {
            if (line.includes('>') && line.length < 100) {
              category = line.trim();
              break;
            }
          }
        }
        
        // Requirement type
        let requirementType = '';
        const reqMatch = text.match(/Requirement Type[:\s]+([^\n]+)/i);
        if (reqMatch) requirementType = reqMatch[1].trim();
        
        // Buyer info
        let buyerInfo = '';
        const buyerMatch = text.match(/Buyer since\s+([^\n]+)/i);
        if (buyerMatch) buyerInfo = buyerMatch[1].trim();
        
        // Description
        let description = '';
        const descMatch = text.match(/([A-Za-z0-9\s,\.\-]{50,300})/);
        if (descMatch) description = descMatch[1].trim();
        
        // Date
        let date = '';
        const dateMatch = text.match(/(Yesterday|Today|Tomorrow|\d+\s+(?:hours?|days?|weeks?|months?))/i);
        if (dateMatch) date = dateMatch[1];
        
        // Check for buy button
        const hasBuyButton = text.includes('Contact Buyer Now');
        
        // Generate ID
        const id = container.dataset.leadId || 
                   container.dataset.inquiryId || 
                   container.getAttribute('data-id') ||
                   'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        
        results.push({
          indiamartId: id,
          title: title || 'Lead',
          companyName: title || '',
          contactPerson: '',
          phone: '',
          email: '',
          productInterest: category || '',
          message: description || text.substring(0, 300),
          budget: '',
          location: location || '',
          requirementType: requirementType || '',
          buyerInfo: buyerInfo || '',
          date: date || '',
          buyAvailable: hasBuyButton,
          fullText: text.substring(0, 500)
        });
      }
      
      return results;
    });
    
    // Filter unique leads
    const uniqueLeads = [];
    const seenTitles = new Set();
    for (const lead of leads) {
      if (!lead.title && !lead.message && !lead.productInterest) continue;
      const key = lead.title + lead.location;
      if (seenTitles.has(key)) continue;
      seenTitles.add(key);
      uniqueLeads.push(lead);
    }
    
    console.log(`📈 Found ${leads.length} raw containers, ${uniqueLeads.length} unique leads`);
    
    if (uniqueLeads.length > 0) {
      console.log('📋 Sample lead:');
      console.log(`   Title: ${uniqueLeads[0].title}`);
      console.log(`   Location: ${uniqueLeads[0].location || 'N/A'}`);
      console.log(`   Category: ${uniqueLeads[0].productInterest || 'N/A'}`);
      console.log(`   Buy Available: ${uniqueLeads[0].buyAvailable}`);
    }
    
    return uniqueLeads;
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    return [];
  }
}
  async run() {
  console.log('🚀 Starting scraper run...');
  try {
    await this.initialize();
    
    const loggedIn = await this.ensureLogin();
    if (!loggedIn) {
      console.log('❌ Cannot proceed without login.');
      console.log('💡 Run: npm run login');
      await this.browser.close();
      return;
    }
    
    const navigated = await this.navigateToBuyLeads();
    if (!navigated) {
      console.log('⚠️ Could not navigate to Buy Leads page');
      await this.browser.close();
      return;
    }
    
    const leads = await this.scrapeLeads();
    
    if (leads.length === 0) {
      console.log('📭 No leads found on page');
      await this.browser.close();
      return;
    }
    
    const results = [];
    const maxLeads = parseInt(process.env.MAX_LEADS_PER_RUN) || 5;
    const leadsToProcess = leads.slice(0, maxLeads);
    
    for (const lead of leadsToProcess) {
      console.log(`\n📋 Processing lead: ${lead.title}`);
      console.log(`   Location: ${lead.location || 'N/A'}`);
      console.log(`   Buy available: ${lead.buyAvailable}`);
      
      let bought = false;
      
      // If auto-buy is enabled and lead has buy button, try to click it
      if (filters.autoBuyConditions && filters.autoBuyConditions.enabled && lead.buyAvailable) {
        console.log('💰 Attempting to buy lead...');
        try {
          // Find the container that contains this lead's title and click its button
          const clicked = await this.page.evaluate((title) => {
            // Search for a container that has the title and a "Contact Buyer Now" button
            const containers = document.querySelectorAll('div, section, article, li');
            for (const container of containers) {
              const text = container.textContent || '';
              if (text.includes(title) && text.includes('Contact Buyer Now')) {
                const btn = container.querySelector('button, a, .btn, [role="button"]');
                if (btn && (btn.textContent.includes('Contact Buyer Now') || btn.textContent.includes('Contact'))) {
                  btn.click();
                  return true;
                }
              }
            }
            return false;
          }, lead.title);
          
          if (clicked) {
            console.log('✅ Clicked "Contact Buyer Now" button');
            await this.sleep(3000);
            
            // Check if any popup or confirmation appears
            const confirmed = await this.page.evaluate(() => {
              const body = document.body.textContent || '';
              return body.includes('Success') || body.includes('Contacted') || body.includes('Purchased');
            });
            if (confirmed) {
              console.log('✅ Lead purchase confirmed!');
              bought = true;
            } else {
              console.log('⚠️ Purchase may have failed or requires additional steps.');
            }
          } else {
            console.log('❌ Could not find buy button for this lead.');
          }
        } catch (error) {
          console.error('❌ Error during buy attempt:', error.message);
        }
      }
      
      // Send to CRM
      const crmResult = await sendToCRM({
        indiamartId: lead.indiamartId || 'lead_' + Date.now(),
        companyName: lead.title || lead.companyName || '',
        contactPerson: lead.contactPerson || '',
        phone: lead.phone || '',
        email: lead.email || '',
        productInterest: lead.productInterest || '',
        message: lead.message || '',
        location: lead.location || '',
        status: bought ? 'Contacted' : 'New'
      });
      
      results.push({ 
        lead: lead.title, 
        bought, 
        synced: crmResult.success 
      });
      
      console.log(`   Synced to CRM: ${crmResult.success ? '✅' : '❌'}`);
      await this.sleep(2000);
    }
    
    console.log(`\n✅ Scraper run completed. Processed ${results.length} leads`);
    console.log(`   Bought: ${results.filter(r => r.bought).length}`);
    console.log(`   Synced to CRM: ${results.filter(r => r.synced).length}`);
    
    await this.browser.close();
    return results;
  } catch (error) {
    console.error('❌ Scraper error:', error.message);
    if (this.browser) await this.browser.close();
    throw error;
  }
}
}

export default IndiaMartScraper;