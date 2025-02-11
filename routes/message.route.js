import express from 'express'
import verifyUser from '../middlewares/verifyUser.js'
import { getAllMessage, sendMessage } from '../controllers/message.controller.js'

const messageRouter = express()

messageRouter.post("/chat", verifyUser, sendMessage)

messageRouter.get('/conversation', verifyUser, getAllMessage)

export default messageRouter