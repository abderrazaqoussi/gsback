const mongoose = require('mongoose')

// name,owner,inviteCode,teamImage,pendingList,creationDate,members,classes
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  teamImage: { data: Buffer, contentType: String },
  owner: { type: String, required: true },
  pendingList: { type: Array },
  inviteCode: { type: String, required: true, unique: true },
  creationDate: { type: Date, default: Date.now },
  members: [{ id: String, role: String }],
  classes: { type: Array },
})

const Team = mongoose.model('Team', teamSchema)
module.exports = Team
