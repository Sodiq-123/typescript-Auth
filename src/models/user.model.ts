import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';


export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (userPassword: string) => Promise<boolean>;
}


const userSchema = new mongoose.Schema(
  {
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  let user = this as UserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // Random additional data
  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

  const hash = await bcrypt.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

// Used for logging in
userSchema.methods.comparePassword = async function(userPassword: string): Promise<boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(userPassword, user.password).catch((err) => false)
}

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;