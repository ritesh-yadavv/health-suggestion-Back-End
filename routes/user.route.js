import express from 'express'    
import verifyUser from '../middlewares/verifyUser.js'
import { updateuser } from '../controllers/user.controller.js'
const userRoute = express.Router()

userRoute.put("/updateuser/:id",verifyUser,updateuser)


export default userRoute



