import { Schema, model } from "mongoose";

const categorySchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    parent: String,
    photo: Buffer
},  { 
    collection: 'categories'
})


export default model("Category", categorySchema);