/*
  Module dependencies
*/
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import facebook from 'passport-facebook'
import User from './models/user'
import pug from 'pug'
import config from './config'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'

// Definition of variables
const app = express()
const port = config.env.port || 3000
const facebookStrategy = facebook.Strategy

// Express configuration
app.set('view engine', 'pug')
app.use(cookieParser())
app.use(bodyParser())
app.use(session({ secret: config.session.secret }))

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

app.use(passport.initialize())
app.use(passport.session())

// Passport Strategies
passport.use(new facebookStrategy({
  clientID: config.fb.clientID,
  clientSecret: config.fb.clientSecret,
  callbackURL: config.fb.callback,
  profileFields: ['id', 'emails', 'displayName', 'picture']
  }, (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
          User.findOne({provider_id: profile.id}, (err, user) => {
            if (err) return done(err)
            if (user) return done(null, user)
            else {
              var newUser = new User()
              newUser.provider_id = profile.id
              newUser.name = profile.displayName
              newUser.photo = profile.photos[0].value
              newUser.provider = 'facebook'

              newUser.save((err) => {
                if(err) throw err
                return done(null, newUser)
              })
            }
          })
        })
      }
  ))

/*
  Passport routes
*/
app.get('/login/facebook', passport.authenticate('facebook'))
app.get('/login/facebook/callback', passport.authenticate('facebook', { successRedirect: '/user', failureRedirect: '/' }))


/*
  Express routes
*/
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/user', (req, res) => {
  res.render('user', {user: req.user})
})

// Start the server
app.listen(port, () => {
  console.log(`[APP] Running on port ${port}.`)
})
