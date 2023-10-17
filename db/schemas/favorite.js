import { Schema, model } from "mongoose";

const favoriteSchema = Schema({
    _id: Schema.Types.ObjectId,
    product: String,
    userId: String
},  { 
    collection: 'favorites'
})


export default model("Favorite", favoriteSchema);