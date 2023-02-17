import { Role } from '@src/constants/role.enum';
import { Status } from '@src/constants/status.enum';
import bcrypt from 'bcrypt';
import { Schema, Document, model, Model } from 'mongoose';
import validator from 'validator';

interface IEmployeeDocument extends Document {
  password: string;
  email: string;
  name: string;
  dob: Date;
  phoneNumber: number;
  createdDate: Date;
  modifiedDate: Date;
  currentTeams: [string];
  status: string;
  role: string;
  isDeleted: boolean;
}

export interface IEmployee extends IEmployeeDocument {
  comparePassword(password: string): Promise<boolean>;
}

const employeeSchema = new Schema<IEmployee>({
  password: { type: String, required: true },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: [validator.isEmail, 'do not match email format'],
  },
  name: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
  dob: { type: Date, required: true },
  phoneNumber: {
    type: Number,
    minlength: 10,
    maxlength: 10,
    required: true,
  },
  currentTeams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  status: {
    type: String,
    enum: Status,
    default: Status.AVAILABLE,
  },
  role: {
    type: String,
    enum: Role,
    required: true,
  },
  isDeleted: { type: Boolean, default: false },
}).index(
  { email: 1 },
  { unique: true, collation: { locale: 'en_US', strength: 1 }, sparse: true },
);

employeeSchema.pre<IEmployeeDocument>('save', function (next): void {
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

employeeSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.__v;
    delete ret.password;
  },
});

employeeSchema.methods.comparePassword = function (
  candidatePassword: string,
): Promise<boolean> {
  const { password } = this;
  return new Promise(function (resolve, reject) {
    bcrypt.compare(candidatePassword, password, function (err, isMatch) {
      if (err) return reject(err);
      return resolve(isMatch);
    });
  });
};

export type IEmployeeModel = Model<IEmployee>;

export const Employee: IEmployeeModel = model<IEmployee, IEmployeeModel>(
  'Employee',
  employeeSchema,
);

export default Employee;
