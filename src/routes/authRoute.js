const passport = require('passport')
const router = require('express').Router()
const jwt = require('jsonwebtoken')

// Function for generating jwt tokens
const generateJwtToken = (user) => {
  const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
    expiresIn: '7d',
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

// This is the callback\redirect url after the OAuth login at Google.
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/auth/login',
  }),
  (req, res) => {
    try {
      console.log({ user: req.user, body: req.body })
      const token = generateJwtToken(req.user)
      res.cookie('jwt', token)
      res.redirect(`${process.env.CLIENT_URL}/`)
    } catch (err) {
      res.json({ err })
    }
  }
)

// Navigating to the root url will ask passport to check for a valid token
// router.get(
//   '/',
//   passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),
//   (req, res) => {
//     res.json({ user: req.user })
//     // res.render('home', { user: req.user })
//   }
// )

// Viewing the profile page will ask passport to check for a valid token
router.get(
  '/profile',
  passport.authenticate('jwt', {
    session: false,
    failureRedirect: 'auth/login',
  }),
  (req, res) => {
    res.json({ page: 'profile', user: req.user })
  }
)

router.get('/login', (_req, res) => {
  res.json({ message: 'Login Page' })
})

router.get('/logout', (req, res) => {
  res.clearCookie('jwt')
  res.redirect('/auth/login')
})

module.exports = router
