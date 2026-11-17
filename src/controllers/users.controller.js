import { usersService } from '../services/users.service.js'
import { HTTP_STATUS } from '../constants/index.js'
import { sendSuccess } from '../utils/response.js'

export const getUsers = async (req, res, next) => {
  try {
    sendSuccess(res, await usersService.getUsers(req.query))
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    sendSuccess(res, await usersService.getUserById(req.params.uid))
  } catch (error) {
    next(error)
  }
}

export const createUser = async (req, res, next) => {
  try {
    sendSuccess(res, await usersService.createUser(req.body), HTTP_STATUS.CREATED)
  } catch (error) {
    next(error)
  }
}

export const updateUserRole = async (req, res, next) => {
  try {
    sendSuccess(res, await usersService.updateUserRole(req.params.uid, req.body?.role))
  } catch (error) {
    next(error)
  }
}
