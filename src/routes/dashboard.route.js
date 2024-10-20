import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import {getSpaces} from '../controllers/dashboard.controller.js'

const router = Router();


export default router;