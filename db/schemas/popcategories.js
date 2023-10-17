import { Schema, model } from "mongoose";

const popcategoriesSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    content: String
},  { 
    collection: 'popcategories'
})


export default model("popcategories", popcategoriesSchema);