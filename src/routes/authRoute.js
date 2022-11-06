const User = require('./../models/userModel')
const passport = require('passport')
const router = require('express').Router()
const jwt = require('jsonwebtoken')

/* 

Handle Google Auth 

*/
// Redirect the user to the Google signin page
router.get('/google', passport.authenticate('google', ['profile', 'email']))

// Retrieve user data using the access token received from Google
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    jwt.sign(
      { user: req.user },
      'secretKey',
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          return res.json({
            token: null,
          })
        }
        res.json({
          token,
        })
      }
    )
  }
)

/*

Handle Strava Auth 

*/
// Redirect the user to the Strava signin page
router.get('/strava', passport.authenticate('strava', ['activity:read']))

// Retrieve user data using the access token received from Strava
router.get(
  '/strava/callback',
  passport.authenticate('strava', {
    successRedirect: '/auth/login/succes',
    failureRedirect: '/login/failed',
  })
)


// oute after successful sign in
router.get('/login/succes', (req, res) => {
  if (req.body) {
    res.status(200).json({
      error: false,
      message: 'Successfully Loged In',
      user: req.body,
    })
  } else {
    console.log(req)
    res.status(403).json({ error: true, message: 'Not Authorized' })
  }
})

router.get('/login/failed', (req, res) => {
  res.status(401).json({
    error: true,
    message: 'Log in Failure',
  })
})

// LogOut the user
router.get('/logout', (req, res) => {
  req.logout()
  req.redirect(process.env.CLIENT_URL)
})

module.exports = router
