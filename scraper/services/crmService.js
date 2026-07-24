import axios from 'axios';

async function sendToCRM(lead) {
  try {
    const response = await axios.post(process.env.CRM_API_URL, lead, {
      headers: {
        'Content-Type': 'application/json',
        // If your CRM uses JWT, you can pass a token here
        // 'x-auth-token': process.env.CRM_API_TOKEN
      },
      timeout: 10000
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Failed to send lead to CRM:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    return { success: false, error: error.message };
  }
}

async function deduplicateLeads(leads) {
  // Simple deduplication based on indiamartId
  const uniqueLeads = [];
  const seenIds = new Set();
  
  for (const lead of leads) {
    if (!seenIds.has(lead.indiamartId) && lead.indiamartId) {
      seenIds.add(lead.indiamartId);
      uniqueLeads.push(lead);
    }
  }
  
  return uniqueLeads;
}

export { sendToCRM, deduplicateLeads };