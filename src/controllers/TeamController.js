const Team = require('./../models/TeamModel')

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
    const { name, owner, inviteLink, creationDate, members, classes } = req.body

    if (!name && !owner && !inviteLink) {
      return res.status(422).json({ message: `Invalid Inputs` })
    }

    let team = new Team({
      name,
      owner,
      inviteLink,
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
  const teamId = req.query.id

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

  const teamId = req.query.id

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
