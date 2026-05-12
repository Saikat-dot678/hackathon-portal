import mongoose, { Schema, model, models } from 'mongoose';

const TeamSchema = new Schema({
  id: String,
  name: { type: String, required: true },
  password: { type: String, required: true }, // Added password field
  leaderName: { type: String, required: true }, 
  email: { type: String, required: true },      
  phone: String,      
  institution: String,
  
  // --- New Fields based on Master Plan ---
  track: { type: String, default: 'Not Selected' },
  ps: { type: String, default: 'Not Selected' },
  ppt: { type: String, default: null },
  members: [{ 
    name: String, 
    email: String, 
    role: String 
  }],
  // ---------------------------------------

  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  githubLink: { type: String, default: null },
  liveLink: { type: String, default: null },
});

// Prevent re-defining the model during Next.js hot reloads
const Team = models.Team || model('Team', TeamSchema);

export default Team;