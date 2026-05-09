import mongoose, { Schema, model, models } from 'mongoose';

const ProblemStatementSchema = new Schema({
  psId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  domain: { type: String, required: true },
  difficulty: { type: String, required: true },
  description: { type: String, required: true },
  
  maxTeams: { type: Number, required: true },
  selectedTeamsCount: { type: Number, default: 0 }
}, { timestamps: true });

// FIX: Safely checks if the model exists before compiling to prevent Next.js HMR crashes
const ProblemStatement = models.ProblemStatement || model('ProblemStatement', ProblemStatementSchema);

export default ProblemStatement;