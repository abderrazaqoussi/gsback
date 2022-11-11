const mongoose = require('mongoose')

// name,email,image,provider.id,provider.name
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  image: { type: String },
  provider: {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
})

const User = mongoose.model('User', userSchema)
module.exports = User
