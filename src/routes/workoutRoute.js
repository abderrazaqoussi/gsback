const workoutRouter = require('express').Router()
const {
  getRecordedWorkouts,
  getPlannedWorkouts,
  addWorkout,
  teamWorkoutsByUserId,
  teamRecordedWorkouts,
} = require('../controllers/workoutController')

workoutRouter.route('/recorded/:id').get(getRecordedWorkouts)
workoutRouter.route('/recorded/teams/:id').get(teamRecordedWorkouts)
workoutRouter.route('/planned/').get(getPlannedWorkouts).post(addWorkout)
workoutRouter
  .route('/planned/teams/:teamId/users/:userId')
  .get(teamWorkoutsByUserId)

module.exports = workoutRouter
