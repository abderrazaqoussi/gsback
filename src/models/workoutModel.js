const mongoose = require('mongoose')

// title,teamId,createdBy,sport,date,athletes,description,tasks
const workoutSchema = new mongoose.Schema({
  title: { type: String },
  teamId: { type: String, required: true },
  createdBy: { type: String, required: true },
  sport: { type: String, required: true },
  date: { type: Date },
  athletes: { type: Array },
  description: { type: String },
  tasks: { type: Array },
})

const Workout = mongoose.model('Workout', workoutSchema)
module.exports = Workout
