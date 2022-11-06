const passport = require('passport')
const StravaStrategy = require('passport-strava-oauth2').Strategy
const User = require('./../models/userModel')

passport.use(
  new StravaStrategy(
    {
      clientID: process.env.STRAVA_ID,
      clientSecret: process.env.STRAVA_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/strava/callback`,
      scope: ['activity:read_all'],
    },

    async function (accessToken, refreshToken, profile, done) {
      // done(null, profile)
      try {
        let existingUser = await User.findOne({
          provider: { id: profile.id, name: 'strava' },
        })
        // if user exists return the user
        if (existingUser) {
          return done(null, existingUser)
        }
        // if user does not exist create a new user
        console.log('Creating new user...')
        const newUser = new User({
          token: profile.access_token,
          name: 'Si Oussi',
          email: 'oussi@gmail.com',
          provider: { id: profile.athlete.id, name: 'strava' },
        })
        await newUser.save()
        return done(null, newUser)
      } catch (error) {
        return done(error, false)
      }
    }
  )
)
