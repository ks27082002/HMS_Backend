import express from "express";
import { config } from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import cloudinary from "cloudinary"
import messageRouter from "./router/messageRouter.js"
import userRouter from "./router/userRouter.js"
import appointmentRouter from "./router/appointmentRouter.js"
import { errorMiddleware } from "./middleware/errorMiddleware.js";

config({path: './config/config.env'})

const app = express()
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}
))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/"
}))

dbConnection()

cloudinary.v2.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
})

app.listen(process.env.PORT, ()=>{
  console.log('App running on Port 4000')
})

app.use('/api/v1/message', messageRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/appointment',appointmentRouter)

app.use(errorMiddleware)
