import mongoose, { Schema, model, models } from 'mongoose';

const SystemConfigSchema = new Schema({
  activePhase: { type: String, default: 'registration' },
  liveStage: { type: String, default: 'opening' },
  timeline: {
    registrationStart: String,
    registrationEnd: String,
    problemSelectionStart: String,
    problemSelectionEnd: String,
    pptSubmissionStart: String,
    pptSubmissionEnd: String,
    finalRoundDate: String,
  },
  panels: { type: Array, default: [] } 
}, { timestamps: true });

const SystemConfig = models.SystemConfig || model('SystemConfig', SystemConfigSchema);

export default SystemConfig;