const User = require('./../models/userModel')

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})

    if (!users) {
      return res.status(500).json({ message: 'Internal Server Error' })
    } else if (users.length === 0) {
      return res.status(404).json({ message: 'No Team Found' })
    } else {
      return res.status(200).json({ status: 'Success', data: users })
    }
  } catch (error) {
    return res.status(501).json({ message: 'Internal Server Error : ' + err })
  }
}
