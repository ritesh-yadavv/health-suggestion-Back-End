import express from 'express'
import dotenv from 'dotenv'
import { connectDb } from './db/connectDb.js'
import authRoute from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.route.js';
import messageRouter from './routes/message.route.js';
import cors from 'cors'

const app = express()
dotenv.config()

// Explicitly allow specific frontend URLs
const allowedOrigins = ["http://localhost:5173", "https://healthapp12.netlify.app"];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser())

const port = process.env.PORT || 5001

app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/mentalhealth", messageRouter);

app.get("/", (req, res) => {
    res.send("server is running")
})

app.listen(port, () => {
    connectDb()
    console.log(`app is running on ${port} `)
})
