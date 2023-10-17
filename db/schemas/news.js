import { Schema, model } from "mongoose";

const newsSchema = Schema({
    _id: Schema.Types.ObjectId,
    content: String
},  { 
    collection: 'news'
})


export default model("News", newsSchema);