import { Schema, model } from "mongoose";

const ordersSchema = Schema({
    _id: Schema.Types.ObjectId,
    buyerType: String,
    buyerName: String,
    buyerPhone: String,
    buyerLastName: String,
    buyerEmail: String,
    deliveryRegion: String,
    deliveryCity: String,
    deliveryCost: Number,
    products: Array,
    count: Array
},  { 
    collection: 'orders'
})


export default model("Orders", ordersSchema);