import { Schema, model } from "mongoose";

const productSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    category: String,
    photo: String,
    price: String,
    count: Number,
    description: String
},  { 
    collection: 'products'
})


export default model("Product", productSchema);