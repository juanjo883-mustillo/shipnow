import { storesService } from '../services/stores.service.js'
import { HTTP_STATUS } from '../constants/index.js'
import { sendSuccess } from '../utils/response.js'

export const getStores = async (req, res, next) => {
  try {
    sendSuccess(res, await storesService.getStores())
  } catch (error) {
    next(error)
  }
}

export const createStore = async (req, res, next) => {
  try {
    sendSuccess(res, await storesService.createStore(req.body), HTTP_STATUS.CREATED)
  } catch (error) {
    next(error)
  }
}
