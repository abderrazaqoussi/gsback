const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: 'secretKey',
    },
    async (jwtPayload, done) => {
      try {
        const user = jwtPayload.user
        done(null, user)
      } catch (error) {
        done(error, false)
      }
    }
  )
)
