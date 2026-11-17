import UserModel from '../models/user.model.js'

// Único lugar que conoce Mongoose para usuarios.
// Proyección por defecto: no expone campos internos de Mongoose.
const PUBLIC_FIELDS = '-__v'

export const usersRepository = {
  findPaginated: async (filter = {}, { page, limit }) => {
    const [docs, total] = await Promise.all([
      UserModel.find(filter, PUBLIC_FIELDS)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(filter),
    ])
    return { docs, total }
  },

  findById: (id) => UserModel.findById(id, PUBLIC_FIELDS).lean(),

  findByEmail: (email) => UserModel.findOne({ email: email.toLowerCase() }, PUBLIC_FIELDS).lean(),

  create: async (data) => {
    const user = await UserModel.create(data)
    return usersRepository.findById(user._id)
  },

  // Devuelve el usuario actualizado, o null si no existe.
  updateById: async (id, data) => {
    const { matchedCount } = await UserModel.updateOne({ _id: id }, data, { runValidators: true })
    return matchedCount > 0 ? usersRepository.findById(id) : null
  },
}
