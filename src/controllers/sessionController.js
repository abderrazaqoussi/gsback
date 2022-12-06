const catchAsync = require('../utils/catchAsync')
const Session = require('../models/sessionModel')
const User = require('../models/userModel')
const fetch = function (...args) {
  return import('node-fetch').then(({ default: fetch }) => fetch(...args))
}

// title,teamId,createdBy,sport,date,athletes,description,tasks

// /recorded/:id
exports.getRecordedSessions = catchAsync(async (req, res) => {
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

// /planified/
exports.getSessions = catchAsync(async (req, res) => {
  const sessions = await Session.find({})

  if (!sessions) {
    return res
      .status(500)
      .json({ status: 'Error', message: 'Internal Server Error' })
  } else if (sessions.length === 0) {
    return res
      .status(404)
      .json({ status: 'Not Found', message: 'No Team Found' })
  } else {
    return res.status(200).json({ status: 'Success', data: sessions })
  }
})

exports.addSession = catchAsync(async (req, res) => {
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

  let session = new Session({
    title,
    teamId,
    createdBy,
    sport,
    date,
    athletes,
    description,
    tasks,
  })

  session = await session.save()
  return res.status(201).json({
    status: 'Success',
    message: `Session Added Successfully`,
    data: session,
  })
})
