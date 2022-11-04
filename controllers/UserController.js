const User = require('../models/UserM')

export const getAllUsers = async (req, res) => {
  let users

  try {
    users = await User.find({})
  } catch (error) {
    return new Error(error)
  }

  if (!users) {
    return res.status(500).json({ message: 'Internal Server Error' })
  } else if (users.length === 0) {
    return res.status(404).json({ message: 'No Team Found' })
  } else {
    return res.status(200).json({ users })
  }
}

export const getUser = async (req, res) => {
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

export const updateUser = async (req, res) => {
  // update by id

  const teamId = req.query.id

  // info to update
  const { name, createdBy } = req.body

  // ** check input values

  if (!name && !createdBy) {
    return res.status(422).json({ message: 'Invalid Inputs' })
  }

  // ** Create new Instance

  let team

  try {
    team = await Team.findByIdAndUpdate(teamId, { name, createdBy })
  } catch (err) {
    return new Error(err)
  }

  // ** Send Respons

  if (!team) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }

  return res.status(200).json({ message: 'Successfully Updated' })
}

export const deleteUser = async (req, res) => {
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
