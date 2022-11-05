const mongoose = require('mongoose')

// name,owner,inviteLink,creationDate,members,classes
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: true },
})

const User = mongoose.model('User', userSchema)
module.exports = User
