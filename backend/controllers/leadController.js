import Lead from "../models/Lead.js";


// Get all leads (with optional filters)
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get single lead
export const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ msg: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Create a new lead (for manual entry or scraper sync)
export const createLead = async (req, res) => {
  try {
    const { indiamartId, companyName, contactPerson, phone, email, productInterest, message } = req.body;
    // Check if lead with same indiamartId exists
    if (indiamartId) {
      const existing = await Lead.findOne({ indiamartId });
      if (existing) return res.status(400).json({ msg: 'Lead already exists' });
    }
    const lead = new Lead({ indiamartId, companyName, contactPerson, phone, email, productInterest, message });
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update lead status
export const updateLead = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findByIdAndUpdate(req.params.id, { status, updatedAt: Date.now() }, { new: true });
    if (!lead) return res.status(404).json({ msg: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete lead
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ msg: 'Lead not found' });
    res.json({ msg: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};