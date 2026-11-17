import OrderModel from '../models/order.model.js'

const PUBLIC_FIELDS = '-__v'

export const ordersRepository = {
  findAll: (filter = {}) => OrderModel.find(filter, PUBLIC_FIELDS).sort({ createdAt: -1 }).lean(),
  findById: (id) => OrderModel.findById(id, PUBLIC_FIELDS).lean(),
  create: async (data) => {
    const order = await OrderModel.create(data)
    return ordersRepository.findById(order._id)
  },
  // Devuelve el pedido actualizado, o null si no existe.
  updateStatus: async (id, status) => {
    const { matchedCount } = await OrderModel.updateOne({ _id: id }, { status }, { runValidators: true })
    return matchedCount > 0 ? ordersRepository.findById(id) : null
  },
}
