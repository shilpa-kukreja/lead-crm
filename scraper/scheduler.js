// const cron = require('node-cron');
// const IndiaMartScraper = require('./services/indiamartScraper');
// require('dotenv').config();

// let isRunning = false;

// async function runScraper() {
//   if (isRunning) {
//     console.log('⏳ Scraper already running, skipping...');
//     return;
//   }
  
//   isRunning = true;
//   console.log('🔄 Starting scheduled scraper run...');
  
//   const scraper = new IndiaMartScraper();
//   try {
//     await scraper.run();
//   } catch (error) {
//     console.error('❌ Scraper failed:', error.message);

//   } finally {
//     isRunning = false;
//   }
// }


// const interval = process.env.SCRAPE_INTERVAL_MINUTES || 5;
// console.log(`⏰ Scheduler started. Running every ${interval} minutes`);


// runScraper();


// cron.schedule(`*/${interval} * * * *`, runScraper);

// import cron from 'node-cron';
// import dotenv from 'dotenv';
// import IndiaMartScraper from './services/indiamartScraper.js';

// dotenv.config();

// let isRunning = false;

// async function runScraper() {
//   if (isRunning) {
//     console.log('⏳ Scraper already running, skipping...');
//     return;
//   }

//   isRunning = true;
//   console.log('🔄 Starting scheduled scraper run...');

//   const scraper = new IndiaMartScraper();

//   try {
//     await scraper.run();
//   } catch (error) {
//     console.error('❌ Scraper failed:', error.message);

//     // Here you could send an alert email or notification
//   } finally {
//     isRunning = false;
//   }
// }

// // Schedule scraper to run every X minutes
// const interval = Number(process.env.SCRAPE_INTERVAL_MINUTES) || 5;

// console.log(`⏰ Scheduler started. Running every ${interval} minutes`);

// // Run immediately on start
// await runScraper();

// // Schedule for every X minutes
// cron.schedule(`*/${interval} * * * *`, async () => {
//   await runScraper();
// });
import cron from 'node-cron';
import IndiaMartScraper from './services/indiamartScraper.js';
import dotenv from 'dotenv';

dotenv.config();

let isRunning = false;

async function runScraper() {
  if (isRunning) {
    console.log('⏳ Scraper already running, skipping...');
    return;
  }
  
  isRunning = true;
  console.log('🔄 Starting scheduled scraper run...');
  
  const scraper = new IndiaMartScraper();
  try {
    await scraper.run();
    console.log('✅ Scraper run completed (even if no leads found)');
  } catch (error) {
    console.error('❌ Scraper failed:', error.message);
  } finally {
    isRunning = false;
  }
}

const interval = parseInt(process.env.SCRAPE_INTERVAL_MINUTES) || 3;
console.log(`⏰ Scheduler started. Running every ${interval} minutes`);

// Run immediately on start
runScraper();

// Schedule
cron.schedule(`*/${interval} * * * *`, runScraper);