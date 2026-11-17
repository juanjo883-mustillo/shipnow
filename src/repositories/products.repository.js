import ProductModel from '../models/product.model.js'

// Único lugar que conoce Mongoose para productos.
// Encapsula reglas de ACCESO a datos (no de negocio):
//  - Filtro por defecto: nunca devuelve productos borrados (soft delete).
//  - Proyección por defecto: no expone campos internos (__v, deletedAt).
const NOT_DELETED = { deletedAt: null }
const PUBLIC_FIELDS = '-__v -deletedAt'

export const productsRepository = {
  findPaginated: async (filter = {}, { page, limit }) => {
    const query = { ...filter, ...NOT_DELETED }
    const [docs, total] = await Promise.all([
      ProductModel.find(query, PUBLIC_FIELDS)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ProductModel.countDocuments(query),
    ])
    return { docs, total }
  },

  findById: (id) => ProductModel.findOne({ _id: id, ...NOT_DELETED }, PUBLIC_FIELDS).lean(),

  create: async (data) => {
    const product = await ProductModel.create(data)
    return productsRepository.findById(product._id)
  },

  // Devuelve el producto actualizado, o null si no existe.
  updateById: async (id, data) => {
    const { matchedCount } = await ProductModel.updateOne({ _id: id, ...NOT_DELETED }, data, {
      runValidators: true,
    })
    return matchedCount > 0 ? productsRepository.findById(id) : null
  },

  // Soft delete: marca deletedAt en vez de borrar. Devuelve true si existía.
  softDeleteById: async (id) => {
    const { matchedCount } = await ProductModel.updateOne(
      { _id: id, ...NOT_DELETED },
      { deletedAt: new Date() }
    )
    return matchedCount > 0
  },
}
