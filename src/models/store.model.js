import mongoose from 'mongoose'

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
  },
  { timestamps: true }
)

export default mongoose.model('Store', storeSchema)
