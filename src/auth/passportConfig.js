const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const StravaStrategy = require('passport-strava-oauth2').Strategy
const JWTStrategy = require('passport-jwt')
const User = require('./../models/userModel')

// Config Google Strategy
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
          // console.log({ existingUser })
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

// Config Strava Strategy
// passport.use(
//   new StravaStrategy(
//     {
//       clientID: process.env.STRAVA_ID,
//       clientSecret: process.env.STRAVA_SECRET,
//       callbackURL: `${process.env.SERVER_URL}/auth/strava/callback`,
//       scope: ['activity:read_all'],
//     },
//     async function (accessToken, refreshToken, profile, done) {
//       // done(null, profile)
//       try {
//         let existingUser0 = await User.findOne({
//           provider: { id: profile.id, name: 'strava' },
//         })
//         // if user exists return the user
//         if (existingUser0) {
//           console.log(true)
//           return done(null, existingUser)
//         }
//         // if user does not exist create a new user
//         console.log('Creating new user...')
//         const newUser = new User({
//           name: profile.displayName,
//           // email: JSON.stringify(profile),
//           image: profile.photos[0].value,
//           provider: { id: profile.id, name: 'strava' },
//         })
//         await newUser.save()
//         return done(null, newUser)
//       } catch (error) {
//         return done(error, false)
//       }
//     }
//   )
// )

// Config JWT Strategy
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
    async (jwtPayload, done) => {
      try {
        //Identify user by ID
        const user = await User.findById(jwtPayload.id)

        if (!user) {
          // console.log({ id: jwtPayload.id, jwtPayload: user })
          return done(null, false)
        }
        return done(null, user)
      } catch (error) {
        return done(error, false)
      }
    }
  )
)
