// All required packages are imported here
const express = require('express')
const passport = require('passport')
// const path = require('path')
const GoogleStrategy = require('passport-google-oauth20')
require('./database/connect') // Connection To DB
const User = require('./models/userModel')
// const FacebookStrategy = require('passport-facebook')
const JWTStrategy = require('passport-jwt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const app = express()
app.use(
  require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  })
)

// Before you can complete the configuration for the Google and Facebook strategies
// you first need to create an application at https://developers.facebook.com/ and at
// https://console.developers.google.com/. You will need the application\client id and
// application\client secret. You also need to give both Facebook and Google your
// application redirect\callback url.

// This is the strategy setup for Google
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
      scope: ['profile', 'email'],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let existingUser = await User.findOne({
          provider: { id: profile.id, name: 'google' },
        })
        // if user exists return the user
        if (existingUser) {
          console.log({ existingUser })
          return done(null, existingUser)
        }
        // if user does not exist create a new user
        console.log('Creating new user...')
        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value,
          provider: { id: profile.id, name: 'google' },
        })

        await newUser.save()
        return done(null, newUser)
      } catch (error) {
        console.log({ error })
        return done(error, false)
      }
    }
  )
)

// This is the strategy setup for JWT so that we can use tokens instead of sessions.
passport.use(
  new JWTStrategy.Strategy(
    {
      jwtFromRequest: (req) => {
        let token = null
        if (req && req.cookies) {
          token = req.cookies.jwt
        }
        return token
      },
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, done) => {
      console.log(jwtPayload)
      if (!jwtPayload) {
        return done('No token found...')
      }
      return done(null, jwtPayload)
    }
  )
)

// Configure Passport authenticated session persistence.
passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((obj, done) => {
  done(null, obj)
})

// Configure view engine to render EJS templates.
// app.set('views', path.join(__dirname, '/views'))
// app.set('view engine', 'ejs')

app.use(express.json())
app.use(cookieParser())
// Initialize Passport and restore authentication state.
app.use(passport.initialize())

// Function for generating jwt tokens
const generateJwtToken = (user) => {
  const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
  return token
}

// This is the route for initiating the OAuth flow to Google
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

// This is the callback\redirect url after the OAuth login at Google.
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateJwtToken(req.user)
    res.cookie('jwt', token)
    res.redirect('/')
  }
)

// Navigating to the root url will ask passport to check for a valid token
app.get(
  '/',
  passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    res.json({ user: req.user })
    // res.render('home', { user: req.user })
  }
)

// Viewing the profile page will ask passport to check for a valid token
app.get(
  '/profile',
  passport.authenticate('jwt', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    res.json({ page: 'profile', user: req.user })
  }
)

app.get('/login', (_req, res) => {
  res.json({ message: 'Login Page' })
})

app.get('/logout', (req, res) => {
  res.clearCookie('jwt')
  res.redirect('/login')
})

app.listen(5000, () => {
  console.log('Server running on port 5000')
})
