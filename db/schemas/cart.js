import { Schema, model } from "mongoose";

const cartSchema = Schema({
    _id: Schema.Types.ObjectId,
    product: String,
    count: Number,
    userId: String
},  { 
    collection: 'cart'
})


export default model("cart", cartSchema);