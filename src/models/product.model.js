import mongoose from 'mongoose'
import { PRODUCT_STATUS } from '../constants/index.js'

// El modelo solo define la forma del documento. Sin lógica de aplicación.
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    category: { type: String, trim: true, lowercase: true, default: 'general' },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.OUT_OF_STOCK,
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

productSchema.index({ status: 1, deletedAt: 1 })

export default mongoose.model('Product', productSchema)
