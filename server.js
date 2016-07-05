/*
  Module dependencies
*/
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import facebook from 'passport-facebook'
import User from './models/user'
import config from './config'

// Definition of variables
const app = express()
const port = config.env.port || 3000
const facebookStrategy = facebook.Strategy

// Database connection
mongoose.connect(config.db.url, (err, res) => {
  if (err) throw err
  console.log('[DATABASE] Database running correctly. Now you can start sending/receiving data.')
})

// Passport middlewares
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

// Passport Strategies
passport.use(new facebookStrategy({
  clientID: config.fb.clientID,
  clientSecret: config.fb.clientSecret,
  callbackURL: config.fb.callback
  }, (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
          User.findOne({provider_id: profile.id}, (err, user) => {
            if (err) return done(err)
            if (user) return done(user)
            else {
              var newUser = new User()
              newUser.provider_id = profile.id
              newUser.name = profile.displayName
              newUser.photo = profile.photos[0].value
              newUser.provider = 'facebook'

              newUser.save((err, user) => {
                if(err) throw err
                return done(null, user)
              })
            }
          }
        })
}))

/*
  Express routes
*/
app.get('/', (req, res) => {
  res.send('Hello World')
})

// Start the server
app.listen(port, () => {
  console.log(`[APP] Running on port ${port}.`)
})
