const passport = require('passport')
const User = require('./../models/userModel')

passport.serializeUser((user, done) => {
  done(null, user.provider.id)
})

passport.deserializeUser(async (id, done) => {
  const currentUser = await User.findOne({ provider: { id } })
  done(null, currentUser)
})
