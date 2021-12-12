import User, { UserDocument } from '../models/user.model';
import { DocumentDefinition, FilterQuery } from 'mongoose';
import { omit } from "lodash";

export async function createUser(input: DocumentDefinition<
  Omit<UserDocument, 'createdAt' |'updatedAt' | 'comparePassword'>>) {
  try {
    const user = await User.create(input);
    return omit(user.toJSON(), 'password');
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return User.findOne(query).lean();
}

export async function validatePassword({
  email,
  password,
}: {
  email: UserDocument["email"];
  password: string;
}) {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user, "password")
}
