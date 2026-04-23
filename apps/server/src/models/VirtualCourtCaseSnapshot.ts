import mongoose, { Schema } from 'mongoose';

export interface VirtualCourtCaseSnapshotDoc {
  caseId: string;
  payload: unknown;
  updatedAt: Date;
}

const snapshotSchema = new Schema<VirtualCourtCaseSnapshotDoc>(
  {
    caseId: { type: String, required: true, unique: true, index: true },
    payload: { type: Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'virtual_court2_snapshots' }
);

export const VirtualCourtCaseSnapshot =
  mongoose.models.VirtualCourtCaseSnapshot ||
  mongoose.model<VirtualCourtCaseSnapshotDoc>('VirtualCourtCaseSnapshot', snapshotSchema);
