const mongoose = require('mongoose')

// name,email,image,provider.id,provider.name
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  image: { type: String },
  teams: Array,
  joinedAt: { type: Date, default: Date.now },
  provider: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    accessToken: String,
    refreshToken: String,
    expiresIn: String,
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
