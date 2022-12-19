const catchAsync = require('../utils/catchAsync')
const Workout = require('../models/workoutModel')
const User = require('../models/userModel')
const Team = require('../models/teamModel')
const fetch = function (...args) {
  return import('node-fetch').then(({ default: fetch }) => fetch(...args))
}

// title,teamId,createdBy,sport,date,athletes,description,tasks

// /recorded/:id
exports.getRecordedWorkouts = catchAsync(async (req, res) => {
  const userId = req.params.id

  // ** Create new Instance
  let user = await User.findById(userId)
  if (!user) {
    return res.status(500).json({
      status: 'Error',
      message: 'Internal Server Error No User Match That Id',
    })
  } else if (user.provider.name === 'strava') {
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?access_token=${user.provider.token}`
    )

    const data = await response.json()
    res.status(200).json({ status: 'Success', length: data.length, data })
  } else {
    return res
      .status(404)
      .json({ status: 'Not Found', message: 'No Recorded Class' })
  }
})

exports.teamRecordedWorkouts = catchAsync(async (req, res) => {
  const id = req.params.id

  // ** Create new Instance
  let team = await Team.findById(id)
  if (!team) {
    return res.status(500).json({
      status: 'Not Found',
      message: 'No Team Match This Id',
    })
  } else {
    let data = []
    team.members.map(async (member, index) => {
      let user = await User.findById(member.id)

      if (user.provider.name === 'strava') {
        const response = await fetch(
          `https://www.strava.com/api/v3/athlete/activities?access_token=${user.provider.token}`
        )

        const parsedData = await response.json()
        data.push({ user, activities: parsedData })
      }
      if (index === team.members.length - 1) {
        if (data.length) {
          res.status(200).json({ status: 'Success', length: data.length, data })
        } else {
          return res
            .status(404)
            .json({ status: 'Not Found', message: 'No Recorded Class' })
        }
      }
    })
  }
})

// /planned/
exports.getPlannedWorkouts = catchAsync(async (req, res) => {
  const workouts = await Workout.find({})

  if (!workouts) {
    return res
      .status(500)
      .json({ status: 'Error', message: 'Internal Server Error' })
  } else if (workouts.length === 0) {
    return res
      .status(404)
      .json({ status: 'Not Found', message: 'No Team Found' })
  } else {
    return res.status(200).json({ status: 'Success', data: workouts })
  }
})

exports.addWorkout = catchAsync(async (req, res) => {
  console.table(req.body)
  const {
    title,
    teamId,
    createdBy,
    sport,
    date,
    athletes,
    description,
    tasks,
  } = req.body

  if (
    !title &&
    !teamId &&
    !createdBy &&
    !sport &&
    !date &&
    !athletes &&
    !tasks
  ) {
    return res.status(422).json({ status: 'Error', message: `Invalid Inputs` })
  }

  let workout = new Workout({
    title,
    teamId,
    createdBy,
    sport,
    date,
    athletes,
    description,
    tasks,
  })

  workout = await workout.save()
  return res.status(201).json({
    status: 'Success',
    message: `Session Added Successfully`,
    data: workout,
  })
})

exports.teamWorkoutsByUserId = catchAsync(async (req, res) => {
  console.log(req.params.userId, req.params.teamId)
  const userId = req.params.userId
  const teamId = req.params.teamId

  let workouts = await Workout.find({ teamId: teamId })
  console.log({ workouts })
  if (!workouts || workouts.length === 0) {
    return res
      .status(404)
      .json({ status: 'Not Found', message: 'No Workouts For This Team' })
  }
  let data = []
  workouts.map((workout) => {
    workout.athletes.map((athlete) => {
      if (athlete.id === userId) {
        data.push(workout)
      }
    })
  })

  //
  if (data.length === 0) {
    return res.status(404).json({
      status: 'Not Found',
      message: 'No Workouts For This User In This Team',
    })
  } else {
    return res.status(200).json({
      status: 'Success',
      data: data,
    })
  }
})
