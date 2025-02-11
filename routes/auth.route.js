import express from 'express'
import { login, logout, signUp } from '../controllers/auth.controller.js'


const authRoute = express.Router()


authRoute.post("/signup",signUp)
authRoute.post("/login",login)
authRoute.post("/logout",logout)


export default authRoute