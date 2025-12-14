import express from "express"
import { create, getAll, getById, remove, update } from "../controllers/futsal.controllers.js"
import upload from "../middleware/multer.middleware.js"
import { USER_ROLE } from "../constants/enums.constants.js"

const router=express.Router()

router.get('/getAll',getAll)
router.get('/:id',getById)
router.post('/create',upload.single('image'),authenticate([USER_ROLE.OWNER]),create)
router.put('/:id',upload.single('image'),authenticate([USER_ROLE.OWNER]),update)
router.delete('/:id',remove)

export default router