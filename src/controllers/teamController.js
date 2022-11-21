const Team = require('../models/teamModel')
const fs = require('fs')

// name,owner,inviteCode,pendingList,creationDate,members,classes
// api/teams
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find({})

    if (!teams) {
      return res.status(500).json({ message: 'Internal Server Error' })
    } else if (teams.length === 0) {
      return res.status(404).json({ message: 'No Team Found' })
    } else {
      return res.status(200).json({ status: 'Success', data: teams })
    }
  } catch (error) {
    return res.status(501).json({ message: 'Internal Server Error : ' + err })
  }
}

exports.addTeam = async (req, res) => {
  try {
    const { name, owner, inviteCode, creationDate } = req.body

    // console.log(__dirname + '/public/')
    if (!name && !owner && !inviteCode) {
      return res.status(422).json({ message: `Invalid Inputs` })
    }

    const teamImage = {
      data: fs.readFileSync(__dirname + '/../public/' + req.file.filename),
      contentType: 'image',
    }

    const members = [{ id: owner, role: 'coach' }]
    const classes = []

    let team = new Team({
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
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' + err })
  }
}

// api/teams/:code
exports.getTeamByInviteCode = async (req, res) => {
  // update by id

  const teamInviteCode = req.params.code

  // ** Create new Instance
  let team

  try {
    team = await Team.find({ inviteCode: teamInviteCode })
  } catch (err) {
    return new Error(err)
  }

  // ** Send Respons

  if (!team) {
    return res.status(404).json({ message: 'No Team Found' })
  }

  return res.status(200).json({ team })
}

// api/teams/:id
exports.getTeam = async (req, res) => {
  // update by id

  const teamId = req.query.id

  // ** Create new Instance
  let team

  try {
    team = await Team.findById(teamId)
  } catch (err) {
    return new Error(err)
  }

  // ** Send Respons

  if (!team) {
    return res.status(404).json({ message: 'No Team Found' })
  }

  return res.status(200).json({ team })
}

exports.updateTeam = async (req, res) => {
  // update by id
  const teamId = req.params.id

  // info to update

  const { teamName, ownerID, creationDate, members, classes } = req.body

  // return res.status(200).json({ req })

  if (!teamName && !ownerID && !creationDate && !members) {
    return res.status(422).json({ message: `Invalid Inputs` })
  }

  // ** Create new Instance
  let team

  try {
    team = await Team.findByIdAndUpdate(teamId, {
      teamName,
      ownerID,
      creationDate,
      members,
      classes,
    })
  } catch (err) {
    return new Error(err)
  }

  // ** Send Respons

  if (!team) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }

  return res.status(200).json({ message: 'Successfully Updated' })
}

exports.deleteTeam = async (req, res) => {
  // update by id

  const teamId = req.params.id

  // ** Create new Instance

  let team

  try {
    team = await Team.findByIdAndRemove(teamId)
  } catch (err) {
    return new Error(err)
  }

  // ** Send Respons

  if (!team) {
    return res.status(500).json({ message: 'Unable To Delete' })
  }

  return res.status(200).json({ message: 'Successfully Deleted' })
}

// api/teams/user/:id
exports.getTeamsByUserId = async (req, res) => {
  try {
    const userId = req.params.id

    const teams = await Team.find({ 'members.id': userId })

    if (!teams) {
      return res.status(500).json({ message: 'Internal Server Error' })
    } else if (teams.length === 0) {
      return res.status(404).json({ message: 'No Team Found' })
    } else {
      return res.status(200).json({
        status: 'Success',
        data: teams,
      })
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' + err })
  }
}

exports.deleteUserFromTeam = async (req, res) => {
  try {
    const teamId = req.params.teamId
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
exports.addUserToPendingList = async (req, res) => {
  try {
    const userId = req.params.userId
    const teamId = req.params.teamId

    let team = await Team.findById(teamId)

    if (!team.pendingList.includes(userId)) {
      team.pendingList.push(userId)
    }
    team = await team.save()
    if (!team) {
      return res.status(500).json({ message: 'Internal Server Error' })
    } else if (team.length === 0) {
      return res.status(404).json({ message: 'No Team Found' })
    } else {
      return res.status(200).json({
        status: 'Success',
        data: team,
      })
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' + err })
  }
}

exports.rejectUserDemand = async (req, res) => {
  try {
    const userId = req.params.userId
    const teamId = req.params.teamId

    let team = await Team.findById(teamId)

    if (team.pendingList.includes(userId)) {
      for (var i = 0; i < team.pendingList.length; i++) {
        if (team.pendingList[i] === userId) {
          team.pendingList.splice(i, 1)
        }
      }
    }
    team = await team.save()
    if (!team) {
      return res.status(500).json({ message: 'Internal Server Error' })
    } else if (team.length === 0) {
      return res.status(404).json({ message: 'No Team Found' })
    } else {
      return res.status(200).json({
        status: 'Success',
        data: team,
      })
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' + err })
  }
}

exports.confirmUserDemand = async (req, res) => {
  try {
    const userId = req.params.userId
    const teamId = req.params.teamId

    let team = await Team.findById(teamId)

    if (!team.pendingList.includes(userId)) {
      return res.status(404).json({ message: 'No Demand Found' })
    }

    for (var i = 0; i < team.pendingList.length; i++) {
      if (team.pendingList[i] === userId) {
        team.pendingList.splice(i, 1)
      }
    }

    team.members.push({ id: userId, role: 'athlete' })

    team = await team.save()
    if (!team) {
      return res.status(500).json({ message: 'Internal Server Error' })
    } else if (team.length === 0) {
      return res.status(404).json({ message: 'No Team Found' })
    } else {
      return res.status(200).json({
        status: 'Success',
        data: team,
      })
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' + err })
  }
}
