import mongoose from "mongoose";
import { customAlphabet } from 'nanoid';
import { UserDocument } from "./user.model";

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);

export interface ProductDocument extends mongoose.Document {
  user: UserDocument["_id"];
  title: string;
  description: string;
  price: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      default: () => `product_${nanoid()}`
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: {  type: String, required: true },
    description: {  type: String, required: true },
    price: {  type: String, required: true },
    image: {  type: String, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model<ProductDocument>("Product", ProductSchema);

export default Product;