const User = require('./../models/UserModel')

exports.logInSuccess = (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: 'Successfully Loged In',
      user: req.user,
    })
  } else {
    res.status(403).json({ error: true, message: 'Not Authorized' })
  }
}
