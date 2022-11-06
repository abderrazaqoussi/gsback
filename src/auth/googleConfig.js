const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('./../models/userModel')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
      scope: ['profile', 'email'],
    },

    async function (accessToken, refreshToken, profile, done) {
      // callback(null, profile)
      try {
        let existingUser = await User.findOne({
          provider: { id: profile.id, name: 'google' },
        })
        // if user exists return the user
        if (existingUser) {
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
        return done(error, false)
      }
    }
  )
)
