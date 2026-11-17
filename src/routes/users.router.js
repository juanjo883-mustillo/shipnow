import { Router } from 'express'
import { getUsers, getUserById, createUser, updateUserRole } from '../controllers/users.controller.js'

const router = Router()

router.get('/', getUsers)
router.get('/:uid', getUserById)
router.post('/', createUser)
router.patch('/:uid/role', updateUserRole)

export default router
