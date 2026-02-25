const blogListRouter = require('express').Router()
const Blog = require('../models/blogList')

blogListRouter.get('/', async (request, response) => {
  const blogList = await Blog.find({})
  response.status(200).json(blogList)
})

blogListRouter.post('/', async (request, response) => {
  if (!request.body){
    response.status(400).json({ error: 'content missing' })
  }
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogListRouter