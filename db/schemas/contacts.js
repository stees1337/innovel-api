import { Schema, model } from "mongoose";

const contactsSchema = Schema({
    _id: Schema.Types.ObjectId,
    type: String,
    content: String
},  { 
    collection: 'contacts'
})


export default model("Contacts", contactsSchema);