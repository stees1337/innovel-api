import * as z from 'zod';
import { getCartById, getCategoryById, getFavoriteById, getProductById, getUserById, getUserByLogin } from '../db/db.js';

export const categoryShema = z.object({
    name: z.string(),
    parent: z.string().refine(async (value) => {
        return value == "root" || (await getCategoryById(value)) != null
    }, {
        message: "ParentId is Invalid"
    })
})

export const registerShema = z.object({
    name: z.string(),
    email: z.string(),
    organization: z.string(),
    login: z.string().refine(async (value) => {
        return (await getUserByLogin(value)) == null
    }, {
        message: "User already exists"
    }),
    password: z.string()
})

export const fileShema = z.object({
    photo: z.object({
        mimetype: z.enum(["image/jpeg", "image/jpg", "image/png", "image/webp"]),
        size: z.number().refine((value) => {
            return value <= 20971520
        }, {
            message: "Max file size is 2 MB"
        })
    })
})

export const productShema = z.object({
    name: z.string(),
    category: z.string().refine(async (value) => {
        return (await getCategoryById(value)) != null
    }, {
        message: "categoryId is Invalid"
    }),
    price: z.string(),
    count: z.string(),
    description: z.string()
})

export const authSchema = z.object({
    login: z.string(),
    password: z.string()
})

export const favoSchema = z.object({
    userId: z.string().refine(async (value) => {
        return (await getUserById(value)) != null
    }, {
        message: "userId is Invalid"
    }),
    product: z.string().refine(async (value) => {
        return (await getProductById(value)) != null
    }, {
        message: "productId is Invalid"
    }),
})

export const cartSchema = z.object({
    product: z.string().refine(async (value) => {
        return (await getProductById(value)) != null
    }, {
        message: "productId is Invalid"
    }),
    count: z.preprocess(
        (input) => {
          const processed = z.string().regex(/^\d+$/).transform(Number).safeParse(input);
          return processed.success ? processed.data : input;
        },
        z.number().min(1)
    ),
    userId: z.string()
})

export const dcartSchema = z.object({
    cartId: z.string().refine(async (value) => {
        return (await getCartById(value)) != null
    }, {
        message: "cartId is Invalid"
    }),
    count: z.preprocess(
        (input) => {
          const processed = z.string().regex(/^\d+$/).transform(Number).safeParse(input);
          return processed.success ? processed.data : input;
        },
        z.number().min(1)
    ),
})

export const dfavoSchema = z.object({
    favoriteId:  z.string().refine(async (value) => {
        return (await getFavoriteById(value)) != null
    }, {
        message: "favoriteId is Invalid"
    }),
})

export const orderSchema = z.object({
    buyerType: z.string(),
    buyerName: z.string(),
    buyerPhone: z.string(),
    buyerLastName: z.string(),
    buyerEmail: z.string().email(),
    deliveryRegion: z.string(),
    deliveryCity: z.string(),
    deliveryCost: z.number(),
    products: z.array(z.string()),
    count: z.array(z.number()),
});


