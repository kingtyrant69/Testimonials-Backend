import express from 'express'
const app = express()

import cors from 'cors'
import cookieParser from 'cookie-parser'

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './routes/user.route.js'
import dashboardRouter from './routes/dashboard.route.js'
import spaceRoute from './routes/space.route.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/spaces", spaceRoute)

export {app} 