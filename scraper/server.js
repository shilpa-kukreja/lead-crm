import dotenv from 'dotenv';
import IndiaMartScraper from './services/indiamartScraper.js';

dotenv.config();

async function main() {
  const scraper = new IndiaMartScraper();
  await scraper.run();
}

main()
  .then(() => {
    console.log('✅ Scraper finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Scraper failed:', error);
    process.exit(1);
  });