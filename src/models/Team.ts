import mongoose, { Schema, model, models } from 'mongoose';

const TeamSchema = new Schema({
  id: String,
  name: { type: String, required: true },
  leaderName: String, 
  email: String,      
  phone: String,      
  institution: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

// This check prevents re-defining the model during Next.js hot reloads
const Team = models.Team || model('Team', TeamSchema);

export default Team;