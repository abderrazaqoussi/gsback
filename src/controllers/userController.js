const User = require('./../models/userModel')
const catchAsync = require('../utils/catchAsync')

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})

    if (!users) {
      return res.status(500).json({ message: 'Internal Server Error' })
    } else if (users.length === 0) {
      return res.status(404).json({ message: 'No Team Found' })
    } else {
      return res
        .status(200)
        .json({ status: 'Success', length: users.length, data: users })
    }
  } catch (error) {
    return res.status(501).json({ message: 'Internal Server Error : ' + err })
  }
}

exports.getUseryById = catchAsync(async (req, res) => {
  // update by id
  const userId = req.params.id

  // ** Create new Instance
  let user = await User.findById(userId)

  // ** Send Respons
  if (!user) {
    return res
      .status(404)
      .json({ status: 'Not Found', message: 'No Team Match With This Id' })
  }

  return res.status(200).json({ status: 'Success', data: user })
})
