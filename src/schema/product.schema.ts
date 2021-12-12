import { object, number, string, TypeOf } from 'zod'

const payload = {
  body: object({
    title: string({
      required_error: 'title is required',
    }),
    price: number({
      required_error: 'price is required',
    }),
    description: string({
      required_error: 'description is required',
    }).min(120, 'description must be at least 120 characters'),
    image: string({
      required_error: 'image is required',
    }),
  })
}

const params = {
  params: object({
    productId: string({
      required_error: 'productId is required',
    })
  })
}

export const createProductSchema = object({
  ...payload
})

export const updateProductSchema = object({
  ...payload, ...params
})

export const getProductSchema = object({
  ...params
})

export const deleteProductSchema = object({
  ...params
})

export type createProductInput= TypeOf<typeof createProductSchema>
export type updateProductInput= TypeOf<typeof updateProductSchema>
export type readProductInput= TypeOf<typeof getProductSchema>
export type deleteProductInput= TypeOf<typeof deleteProductSchema>