const express = require('express')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const blogListRouter = require('./Controllers/blogListRouter')

const app = express()

const mongoUrl = config.MONGODB_URL

// logger.info('connecting to', mongoUrl)

mongoose.connect(mongoUrl, { family: 4 })
  .then(() => {
    logger.info('connected to database')
  })
  .catch(() => {
    logger.error('error connnecting to dbase')
  })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogListRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app