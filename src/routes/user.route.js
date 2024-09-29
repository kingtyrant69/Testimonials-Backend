import {Router} from 'express';
import {
  loginUser, 
  logoutUser, 
  registerUser, 
  refreshAccessToken, 
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import multer from 'multer'

const upload = multer();
const router = Router()

router.route('/register').post(upload.none(), registerUser)

router.route('/login').post(upload.none(), loginUser)

router.route("/logout").post(verifyJWT, logoutUser)

router.route('/refresh-token').post(refreshAccessToken)


export default router