const mongoose = require('mongoose')

// name,owner,inviteLink,creationDate,members,classes
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  inviteLink: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  members: { type: Array },
  classes: { type: Array },
})

const Team = mongoose.model('Team', teamSchema)
module.exports = Team
