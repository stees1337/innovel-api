import { Schema, model } from "mongoose";

const partnersSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    content: String
},  { 
    collection: 'partners'
})


export default model("Partners", partnersSchema);