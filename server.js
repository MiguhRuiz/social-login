/*
  Module dependencies
*/
import express from 'express'
import mongoose from 'mongoose'
import config from './config'

// Definition of variables
const app = express()
const port = config.env.port || 3000

// Database connection
mongoose.connect(config.db.url, (err, res) => {
  if (err) throw err
  console.log('[DATABASE] Database running correctly. Now you can start sending/receiving data.')
})

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
