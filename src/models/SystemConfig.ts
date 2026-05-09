import mongoose, { Schema, model, models } from 'mongoose';

const SystemConfigSchema = new Schema({
  activePhase: { type: String, default: 'registration' },
  liveStage: { type: String, default: 'mentoring_2' },
  
  timeline: {
    registrationStart: Date,
    registrationEnd: Date,
    problemSelectionStart: Date,
    problemSelectionEnd: Date,
    pptSubmissionStart: Date,
    pptSubmissionEnd: Date,
    finalRoundDate: Date,
  }
}, { timestamps: true });

const SystemConfig = models.SystemConfig || model('SystemConfig', SystemConfigSchema);

export default SystemConfig;