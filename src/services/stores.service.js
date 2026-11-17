import { storesRepository } from '../repositories/stores.repository.js'
import { ERRORS } from '../constants/index.js'
import { AppError } from '../utils/app-error.js'

export const storesService = {
  getStores: () => storesRepository.findAll(),

  createStore: async ({ name, address } = {}) => {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new AppError(ERRORS.VALIDATION_ERROR, ['name es obligatorio'])
    }
    return storesRepository.create({ name, address })
  },
}
