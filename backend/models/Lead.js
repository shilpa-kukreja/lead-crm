import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  indiamartId: { type: String, unique: true, sparse: true }, // from IndiaMART
  companyName: String,
  contactPerson: String,
  phone: String,
  email: String,
  productInterest: String,
  message: String,
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Qualified', 'Lost'], 
    default: 'New' 
  },
  source: { type: String, default: 'IndiaMART' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Lead', LeadSchema);