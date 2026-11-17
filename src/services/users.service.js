import { usersRepository } from '../repositories/users.repository.js'
import { USER_ROLES, ERRORS } from '../constants/index.js'
import { AppError } from '../utils/app-error.js'
import { parsePagination } from '../utils/pagination.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_ROLES = Object.values(USER_ROLES)

const ensureValidRole = (role) => {
  if (!VALID_ROLES.includes(role)) {
    throw new AppError(ERRORS.INVALID_USER_ROLE, [`role debe ser uno de: ${VALID_ROLES.join(', ')}`])
  }
}

const ensureExists = (user) => {
  if (!user) throw new AppError(ERRORS.USER_NOT_FOUND)
  return user
}

export const usersService = {
  getUsers: async ({ role, ...query } = {}) => {
    const pagination = parsePagination(query)
    const filter = {}
    if (role) {
      ensureValidRole(role)
      filter.role = role
    }
    const { docs, total } = await usersRepository.findPaginated(filter, pagination)
    return { docs, total, ...pagination, totalPages: Math.ceil(total / pagination.limit) }
  },

  getUserById: async (id) => ensureExists(await usersRepository.findById(id)),

  createUser: async ({ name, email, role } = {}) => {
    const errors = []
    if (typeof name !== 'string' || name.trim() === '') errors.push('name es obligatorio')
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) errors.push('email es obligatorio y debe ser válido')
    if (errors.length > 0) throw new AppError(ERRORS.VALIDATION_ERROR, errors)

    // Regla de negocio: todo usuario nuevo es USER salvo que se indique otro rol válido.
    const finalRole = role ?? USER_ROLES.USER
    ensureValidRole(finalRole)

    // Regla de negocio: el email es único.
    if (await usersRepository.findByEmail(email)) throw new AppError(ERRORS.EMAIL_ALREADY_EXISTS)

    return usersRepository.create({ name, email, role: finalRole })
  },

  updateUserRole: async (id, role) => {
    ensureValidRole(role)
    return ensureExists(await usersRepository.updateById(id, { role }))
  },
}
