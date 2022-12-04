const passport = require('passport')
const router = require('express').Router()
const jwt = require('jsonwebtoken')

// Function for generating jwt tokens
const generateJwtToken = (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '2d',
  })
  return token
}

// This is the route for initiating the OAuth flow to Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

router.get(
  '/strava',
  passport.authenticate('strava', {
    scope: ['read_all,profile:read_all,activity:read,activity:read_all'],
    approval_prompt: 'force',
  })
)

// This is the callback\redirect url after the OAuth login at Google.
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/signin`,
  }),
  (req, res) => {
    const token = generateJwtToken(req.user)
    res.cookie('jwt', token)
    // res.setHeader('Set-Cookie', `jwt=${token}`)
    res.redirect(`${process.env.CLIENT_URL}/`)
  }
)

router.get(
  '/strava/callback',
  passport.authenticate('strava', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/signin`,
  }),
  (req, res) => {
    const token = generateJwtToken(req.user)
    res.cookie('jwt', token)
    // res.setHeader('Set-Cookie', `jwt=${token}`)
    res.redirect(`${process.env.CLIENT_URL}/`)
  }
)

// Viewing the profile page will ask passport to check for a valid token
router.get(
  '/me',
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/signin`,
  }),

  (req, res) => {
    if (req.user) {
      return res.json({ status: 'success', user: req.user })
    }
    return res.json({ status: 'success', user: 'No User Data' })
  }
)

router.get('/logout', (req, res) => {
  res.clearCookie('jwt')
  res.redirect(`${process.env.CLIENT_URL}/signin`)
})

module.exports = router
