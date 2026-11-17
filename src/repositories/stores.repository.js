import StoreModel from '../models/store.model.js'

const PUBLIC_FIELDS = '-__v'

export const storesRepository = {
  findAll: () => StoreModel.find({}, PUBLIC_FIELDS).sort({ name: 1 }).lean(),
  findById: (id) => StoreModel.findById(id, PUBLIC_FIELDS).lean(),
  create: async (data) => {
    const store = await StoreModel.create(data)
    return storesRepository.findById(store._id)
  },
}
