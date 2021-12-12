import { Request, Response } from "express";
import { createProductInput, updateProductInput } from "../schema/product.schema";
import { createProduct, findProduct, findAndUpdateProduct, deleteProduct } from "../service/product.service";

export async function createProductHandler(
  req: Request<{},{}, createProductInput['body']>, 
  res: Response) {
  try {
    const userId = res.locals.user._id
    const body = req.body
    const product = await createProduct({...body, user: userId})
    return res.status(201).send(product)
  } catch (error: any) {
    return res.status(400).send(error.message)
  }
}

export async function updateProductHandler(
  req: Request<updateProductInput['params']>,
  res: Response) {
  try {
    const userId = res.locals.user._id
    const productId = req.params.productId
    const update = req.body
    const product = await findProduct({productId})
    if (!product) {
      return res.status(404).send('Product not found')
    }
    if (product.user !== userId) {
      return res.status(403).send('You are not allowed to update this product')
    }

    const updatedProduct = await findAndUpdateProduct({ productId }, update, { new: true })
    return res.status(200).send(updatedProduct)
  } catch (error: any) {
    return res.status(400).send(error.message)
  }
}

export async function getProductHandler(
  req: Request<updateProductInput['params']>, 
  res: Response) {
  try {
    const productId = req.params.productId;
    const product = await findProduct({ productId })
    if (!product) {
      return res.status(404).send('Product not found')
    }
    return res.status(200).send(product)
  } catch (error: any) {
    return res.status(400).send(error.message)
  }
}

export async function deleteProductHandler(
  req: Request<updateProductInput['params']>, 
  res: Response) {
  try {
    const userId = res.locals.user._id
    const productId = req.params.productId

    const product = await findProduct({productId})
    if (!product) {
      return res.status(404).send('Product not found')
    }
    if (product.user !== userId) {
      return res.status(403).send('You are not allowed to delete this product')
    }
    await deleteProduct({ productId })
    return res.status(200).send('Product deleted')
  } catch (error: any) {
    return res.status(400).send(error.message)
  }
}