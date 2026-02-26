const blogListRouter = require('express').Router()
const Blog = require('../models/blogList')

blogListRouter.get('/', async (request, response) => {
  const blogList = await Blog.find({})
  response.status(200).json(blogList)
})

blogListRouter.post('/', async (request, response) => {
  const { title, url } = request.body

  if (!title || !url) {
    return response.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogListRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true, runValidators: true, context: 'query' }
  )

  if (!updatedBlog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  response.status(200).json(updatedBlog)
})

blogListRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndDelete(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  response.status(204).end()
})

module.exports = blogListRouter