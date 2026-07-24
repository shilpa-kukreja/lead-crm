import express from 'express';
import { createLead, deleteLead, getLead, getLeads, updateLead } from '../controllers/leadController.js';
import { authtoken } from '../middleware/auth.js';
import Lead from "../models/Lead.js";

const leadrouter = express.Router();

leadrouter.get('/', authtoken, getLeads);
leadrouter.get('/:id', authtoken, getLead);
leadrouter.post('/', authtoken, createLead);
leadrouter.put('/:id', authtoken, updateLead);
leadrouter.delete('/:id', authtoken, deleteLead);
leadrouter.post('/sync', async (req, res) => {
  try {
    const { indiamartId, companyName, contactPerson, phone, email, productInterest, message, location, status } = req.body;
    
    // Check if lead exists
    if (indiamartId) {
      const existing = await Lead.findOne({ indiamartId });
      if (existing) {
        return res.status(200).json({ msg: 'Lead already exists', lead: existing });
      }
    }
    
    const lead = new Lead({ 
      indiamartId, 
      companyName, 
      contactPerson, 
      phone, 
      email, 
      productInterest, 
      message,
      location,
      status: status || 'New'
    });
    await lead.save();
    res.status(201).json({ msg: 'Lead synced successfully', lead });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

export default leadrouter;