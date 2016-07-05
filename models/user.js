import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  provider_id: {type: String, unique: true},
  name: String,
  photo: String,
  provider: String
})

module.exports = mongoose.model('User', schema)
