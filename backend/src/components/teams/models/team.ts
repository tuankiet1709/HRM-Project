import { Role } from '@src/constants/role.enum';
import { Status } from '@src/constants/status.enum';
import bcrypt from 'bcrypt';
import { Schema, Document, model, Model, SchemaType } from 'mongoose';
import validator from 'validator';

export interface ITeamDocument extends Document {
  name: string;
  leader: Schema.Types.ObjectId;
  createdDate: Date;
  modifiedDate: Date;
  createdBy: Schema.Types.ObjectId;
  employees: [string];
  isDeleted: boolean;
}

const teamSchema = new Schema<ITeamDocument>({
  name: { type: String, required: true },
  leader: { type: Schema.Types.ObjectId, ref: 'Employee' },
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Employee' },
  employees: [{ type: Schema.Types.ObjectId, ref: 'Employee' }],
  isDeleted: { type: Boolean, default: false },
});

teamSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.__v;
  },
});

export type ITeamModel = Model<ITeamDocument>;

export const Team: ITeamModel = model<ITeamDocument, ITeamModel>(
  'Team',
  teamSchema,
);

export default Team;
