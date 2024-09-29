import {Router} from 'express'
import { getSpaceById, getUserSpaces, createSpace, deleteSpace, updateSpace } from '../controllers/space.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router();

router.use(verifyJWT)


router.route('/').get(getUserSpaces)

router.route('/create-space').post(createSpace)
router.route('/:spaceId').delete(deleteSpace).patch(updateSpace).get(getSpaceById);

export default router

