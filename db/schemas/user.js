import { Schema, model } from "mongoose";

const userSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    login: String,
    email: String,
    econfirmation: Boolean,
    token: String,
    organization: String,
    admin: Boolean
},  { 
    collection: 'users'
})


export default model("User", userSchema);