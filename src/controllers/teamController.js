const Team = require('../models/teamModel')
const catchAsync = require('../utils/catchAsync')
const generateRandomStr = require('../utils/generateRandomStr')
const fs = require('fs')

// name,owner,inviteCode,pendingList,creationDate,members,classes

// api/teams
exports.getTeams = catchAsync(async (req, res) => {
  const teams = await Team.find({})

  if (!teams) {
    return res
      .status(500)
      .json({ status: 'Error', message: 'Internal Server Error' })
  } else if (teams.length === 0) {
    return res
      .status(404)
      .json({ status: 'Not Found', message: 'No Team Found' })
  } else {
    return res.status(200).json({ status: 'Success', data: teams })
  }
})

exports.addTeam = catchAsync(async (req, res) => {
  const { name, owner } = req.body

  // console.log(__dirname + '/public/')
  if (!name && !owner) {
    return res.status(422).json({ status: 'Error', message: `Invalid Inputs` })
  }

  let team = await Team.find({ name })
  if (team) {
    return res.status(422).json({
      status: 'Error',
      message: `Invalid Inputs : Team With Same Name Found`,
    })
  }

  const teamImage = {
    data: fs.readFileSync(__dirname + '/../public/' + req.file.filename),
    contentType: 'image',
  }

  const members = [{ id: owner, role: 'coach' }]
  const classes = []
  const inviteCode = generateRandomStr()
  const creationDate = Date.now()

  team = new Team({
    name,
    owner,
    teamImage,
    inviteCode,
    creationDate,
    members,
    classes,
  })
  team = await team.save()
  return res.status(201).json({
    status: 'Success',
    message: `Team Added Successfully`,
    data: team,
  })
})

// api/teams/:id
exports.getTeamByID = catchAsync(async (req, res) => {
  // update by id

  const teamId = req.query.id

  // ** Create new Instance
  let team = await Team.findById(teamId)

  // ** Send Respons

  if (!team) {
    return res
      .status(404)
      .json({ status: 'Not Found', message: 'No Team Match With This Id' })
  }

  return res.status(200).json({ status: 'Success', data: team })
})

exports.deleteTeamByID = catchAsync(async (req, res) => {
  // update by id

  const teamId = req.params.id

  // ** Create new Instance

  let team = await Team.findByIdAndRemove(teamId)

  // ** Send Respons

  if (!team) {
    return res
      .status(500)
      .json({ status: 'Error', message: 'Unable To Delete' })
  }

  return res
    .status(200)
    .json({ status: 'Success', message: 'Successfully Deleted' })
})

// api/teams/:code
exports.getTeamByCode = catchAsync(async (req, res) => {
  // update by id

  const teamInviteCode = req.params.code

  // ** Create new Instance
  let team = await Team.find({ inviteCode: teamInviteCode })

  // ** Send Respons

  if (!team) {
    return res
      .status(404)
      .json({ status: 'Not Found', message: 'No Team Found' })
  }

  return res.status(200).json({ status: 'Success', data: team })
})

// api/teams/user/:id
exports.getTeamsByUserId = catchAsync(async (req, res) => {
  const userId = req.params.id

  const teams = await Team.find({ 'members.id': userId })

  if (!teams) {
    return res
      .status(500)
      .json({ status: 'Error', message: 'Internal Server Error' })
  } else if (teams.length === 0) {
    return res
      .status(404)
      .json({ status: 'Not Found', message: 'No Team Found' })
  } else {
    return res.status(200).json({
      status: 'Success',
      data: teams,
    })
  }
})

exports.deleteUserFromTeam = async (req, res) => {
  try {
    const { id: teamId } = req.body
    const userId = req.params.userId

    const teams = await Team.findOneAndDelete({ 'members.id': userId })

    if (!teams) {
      return res.status(500).json({ message: 'Internal Server Error' })
    } else if (teams.length === 0) {
      return res.status(404).json({ message: 'No Team Found' })
    } else {
      return res.status(200).json({ status: 'Success', data: teams })
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' + err })
  }
}

// api/teams/user/:userId/:teamId
exports.addUserToPendingList = catchAsync(async (req, res) => {
  const userId = req.params.userId
  const teamId = req.params.teamId

  let team = await Team.findById(teamId)

  if (!team.pendingList.includes(userId)) {
    team.pendingList.push(userId)
  }
  team = await team.save()
  if (!team) {
    return res
      .status(500)
      .json({ status: 'Error', message: 'Internal Server Error' })
  } else if (team.length === 0) {
    return res
      .status(404)
      .json({ status: 'Not Found', message: 'No Team Found' })
  } else {
    return res.status(200).json({
      status: 'Success',
      data: team,
    })
  }
})

// /:teamId/user/:userId/rejected
exports.rejectUserDemand = catchAsync(async (req, res) => {
  const userId = req.params.userId
  const teamId = req.params.teamId

  let team = await Team.findById(teamId)

  if (!team.pendingList.includes(userId)) {
    return res
      .status(404)
      .json({ status: 'Not Found', message: 'No Demand Found' })
  }

  for (var i = 0; i < team.pendingList.length; i++) {
    if (team.pendingList[i] === userId) {
      team.pendingList.splice(i, 1)
    }
  }

  team = await team.save()
  if (!team) {
    return res
      .status(500)
      .json({ status: 'Error', message: 'Internal Server Error' })
  } else if (team.length === 0) {
    return res
      .status(404)
      .json({ status: 'Not Found', message: 'No Team Found' })
  } else {
    return res.status(200).json({
      status: 'Success',
      data: team,
    })
  }
})

// /:teamId/user/:userId/confirmed
exports.confirmUserDemand = catchAsync(async (req, res) => {
  const userId = req.params.userId
  const teamId = req.params.teamId

  let team = await Team.findById(teamId)

  if (!team.pendingList.includes(userId)) {
    return res
      .status(404)
      .json({ status: 'Not Found', message: 'No Demand From This User' })
  }

  for (var i = 0; i < team.pendingList.length; i++) {
    if (team.pendingList[i] === userId) {
      team.pendingList.splice(i, 1)
    }
  }

  team.members.push({ id: userId, role: 'athlete' })

  team = await team.save()
  if (!team) {
    return res
      .status(500)
      .json({ status: 'Error', message: 'Internal Server Error' })
  } else if (team.length === 0) {
    return res
      .status(404)
      .json({ status: 'Not Found', message: 'No Team Found' })
  } else {
    return res.status(200).json({
      status: 'Success',
      data: team,
    })
  }
})
