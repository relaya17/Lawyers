import mongoose, { Schema, type InferSchemaType } from 'mongoose';

/**
 * סשן חדר דיונים חי — מייצג דיון בית משפט בזמן אמת.
 * נשמר ב-MongoDB, מעודכן בזמן אמת ע"י socket events + REST.
 */

const participantSchema = new Schema(
  {
    userId: { type: String, required: true },
    displayName: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: [
        'judge',
        'student_judge',
        'ai_judge',
        'prosecutor',
        'plaintiff_lawyer',
        'defense_lawyer',
        'plaintiff',
        'defendant',
        'witness',
        'expert',
        'clerk',
        'mediator',
        'observer',
      ],
    },
    color: { type: String, required: true },
    avatarUrl: { type: String },
    joinedAt: { type: Date, default: Date.now },
    leftAt: { type: Date },
    isSpeaking: { type: Boolean, default: false },
    micEnabled: { type: Boolean, default: true },
    videoEnabled: { type: Boolean, default: true },
  },
  { _id: false },
);

const protocolLineSchema = new Schema(
  {
    lineId: { type: String, required: true },
    ts: { type: Date, default: Date.now },
    speakerUserId: { type: String },
    speakerName: { type: String, required: true },
    speakerRole: { type: String, required: true },
    color: { type: String, required: true },
    text: { type: String, required: true },
    entryType: {
      type: String,
      enum: ['statement', 'question', 'objection', 'ruling', 'evidence', 'note', 'system'],
      default: 'statement',
    },
    isAiGenerated: { type: Boolean, default: false },
    verifiedBySecretary: { type: Boolean, default: false },
    editedBy: { type: String },
    editedAt: { type: Date },
    aiConfidence: { type: Number },
  },
  { _id: false },
);

const evidenceSchema = new Schema(
  {
    evidenceId: { type: String, required: true },
    kind: {
      type: String,
      enum: ['document', 'image', 'video', 'audio', 'confidential_report', 'exhibit'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    url: { type: String },
    submittedByUserId: { type: String },
    submittedAt: { type: Date, default: Date.now },
    admittedAt: { type: Date },
    accessLevel: {
      type: String,
      enum: ['all', 'judges_only', 'prosecution_only', 'defense_only'],
      default: 'all',
    },
    currentlyPresented: { type: Boolean, default: false },
  },
  { _id: false },
);

const courtroomSessionSchema = new Schema(
  {
    caseId: { type: String, required: true, index: true },
    hearingId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'ended'],
      default: 'scheduled',
      index: true,
    },
    mode: {
      type: String,
      enum: ['open', 'closed_doors', 'appeal', 'mediation'],
      default: 'open',
    },
    courtLevel: {
      type: String,
      enum: ['magistrate', 'district', 'supreme'],
      required: true,
    },
    caseTrack: {
      type: String,
      enum: [
        'civil',
        'criminal',
        'administrative',
        'labor',
        'family',
        'commercial_mediation',
        'plea_bargain',
      ],
      required: true,
    },
    title: { type: String, required: true },

    participants: { type: [participantSchema], default: [] },
    protocol: { type: [protocolLineSchema], default: [] },
    evidence: { type: [evidenceSchema], default: [] },

    currentSpeakerUserId: { type: String },

    startedAt: { type: Date },
    endedAt: { type: Date },
  },
  { collection: 'courtroom_sessions', timestamps: true },
);

courtroomSessionSchema.index({ caseId: 1, hearingId: 1 }, { unique: true });

export type CourtroomSessionDoc = InferSchemaType<typeof courtroomSessionSchema>;

export const CourtroomSession =
  mongoose.models.CourtroomSession ||
  mongoose.model<CourtroomSessionDoc>('CourtroomSession', courtroomSessionSchema);
