import express from "express"
import { changePassword, login, logout, register } from "../controllers/auth.controllers.js"

const router=express.Router()

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.post('/changePassword',changePassword)

export default router