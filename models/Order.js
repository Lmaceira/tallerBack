const mongoose = require('mongoose')

const { model, Schema } = mongoose

const orderSchema = new Schema({
  client: Object,
      name: String,
      phone: String,
      email: String,
  vehicle: Object,
      brand: String,
      carPlate: String,
      chassis: String,
  problemDesc: String,
  jobDesc: String,
  scannerFile: String,
  total: Number,
  workDate: Date,
  pieceRef: String
})

orderSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
  }
})

const Order = model('Order', orderSchema)

module.exports = Order