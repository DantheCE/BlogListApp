const blogListRouter = require('express').Router()
const Blog = require('../models/blogList')
const logger = require('../utils/logger')

blogListRouter.get('/', (request, response) => {
    Blog.find({}).then((blogs) => {
        response.json(blogs)
    })
})

blogListRouter.post('/', (request, response) => {
   logger.info('request', request.body) 
    const blog = new Blog(request.body)

    blog.save().then((result) => {
        response.status(201).json(result)
    })
})

module.exports = blogListRouter