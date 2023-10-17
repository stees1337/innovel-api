import express from "express";
import bodyParser from "body-parser";
import { connect } from "./db/db.js";
import shopRouter from "./routes/shopRouter.js"
import fileUpload from 'express-fileupload';
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express()

const PORT = 1337

connect()

app.use(cors({
    origin: "*"
    , credentials: true
}))
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload())
app.use('/api/', shopRouter)

app.listen(PORT, () => console.log(`api started on *:${PORT}`))
