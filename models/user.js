import mongoose from 'mongoose'

const User = new mongoose.Schema({
  provider_id: {type: String, unique: true},
  name: String,
  photo: String,
  provider: String
})
