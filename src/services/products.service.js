import { productsRepository } from '../repositories/products.repository.js'
import { PRODUCT_STATUS, ERRORS } from '../constants/index.js'
import { AppError } from '../utils/app-error.js'
import { parsePagination } from '../utils/pagination.js'

// Campos que el cliente puede enviar. `status` NO está: se calcula a partir del stock.
const EDITABLE_FIELDS = ['title', 'description', 'category', 'price', 'stock']

// Regla de negocio: el estado de un producto se deriva de su stock.
// Así `status` y `stock` nunca pueden contradecirse.
export const resolveProductStatus = (stock) =>
  stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK

const pickEditableFields = (data = {}) =>
  Object.fromEntries(Object.entries(data).filter(([key]) => EDITABLE_FIELDS.includes(key)))

const validateProductData = (data, { partial = false } = {}) => {
  const errors = []
  const isPresent = (value) => value !== undefined

  if (!partial || isPresent(data.title)) {
    if (typeof data.title !== 'string' || data.title.trim() === '') {
      errors.push('title es obligatorio y debe ser un texto')
    }
  }
  if (!partial || isPresent(data.price)) {
    if (typeof data.price !== 'number' || data.price < 0) {
      errors.push('price es obligatorio y debe ser un número mayor o igual a 0')
    }
  }
  if (isPresent(data.stock) && (!Number.isInteger(data.stock) || data.stock < 0)) {
    errors.push('stock debe ser un entero mayor o igual a 0')
  }
  if (partial && Object.keys(data).length === 0) {
    errors.push(`Enviá al menos un campo para actualizar: ${EDITABLE_FIELDS.join(', ')}`)
  }

  if (errors.length > 0) throw new AppError(ERRORS.VALIDATION_ERROR, errors)
}

const buildPage = ({ docs, total }, { page, limit }) => ({
  docs,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
})

const ensureExists = (product) => {
  if (!product) throw new AppError(ERRORS.PRODUCT_NOT_FOUND)
  return product
}

export const productsService = {
  // Catálogo público: solo productos disponibles (la consulta filtra en Mongo, no en memoria).
  getAvailableProducts: async ({ category, ...query } = {}) => {
    const pagination = parsePagination(query)
    const filter = { status: PRODUCT_STATUS.AVAILABLE }
    if (category) filter.category = category.toLowerCase()
    return buildPage(await productsRepository.findPaginated(filter, pagination), pagination)
  },

  // Inventario completo (disponibles y sin stock), para gestión interna.
  getInventory: async ({ status, ...query } = {}) => {
    const pagination = parsePagination(query)
    const filter = {}
    if (status) {
      if (!Object.values(PRODUCT_STATUS).includes(status)) {
        throw new AppError(ERRORS.VALIDATION_ERROR, [
          `status debe ser uno de: ${Object.values(PRODUCT_STATUS).join(', ')}`,
        ])
      }
      filter.status = status
    }
    return buildPage(await productsRepository.findPaginated(filter, pagination), pagination)
  },

  getProductById: async (id) => ensureExists(await productsRepository.findById(id)),

  createProduct: async (data) => {
    const productData = pickEditableFields(data)
    validateProductData(productData)
    const stock = productData.stock ?? 0
    return productsRepository.create({ ...productData, stock, status: resolveProductStatus(stock) })
  },

  updateProduct: async (id, data) => {
    const changes = pickEditableFields(data)
    validateProductData(changes, { partial: true })
    if (changes.stock !== undefined) changes.status = resolveProductStatus(changes.stock)
    return ensureExists(await productsRepository.updateById(id, changes))
  },

  deleteProduct: async (id) => {
    const deleted = await productsRepository.softDeleteById(id)
    if (!deleted) throw new AppError(ERRORS.PRODUCT_NOT_FOUND)
  },
}
