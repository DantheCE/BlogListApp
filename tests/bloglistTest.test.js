const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogList')
const testHelper = require('../tests/test_helper')
const totalLikes = require('../utils/list_helper').totalLikes
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const mostBlogs = require('../utils/list_helper').mostBlogs
const mostLikes = require('../utils/list_helper').mostLikes

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(testHelper.listWithMultipleBlogs)
})

describe('GET endpoint', () => {
  test('notes are returned successfully and in the right format', async () => {
    const results = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    console.log(results)
    assert.strictEqual(results.body.length, testHelper.listWithMultipleBlogs.length)
  }
  )
})

describe('unique identifier format validation', () => {
  test('.id and not ._id is present', async () => {
    const savedBlogs = await testHelper.getAllBlogsDb()
    console.log(savedBlogs)
    assert(savedBlogs[0].id)
  })
})

describe('POST endpoint', () => {
  test('succeeds with valid data', async () => {
    const newBlogs = {
      title: 'this is a new blog post',
      author: 'Daniel F',
      url: 'http://example.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlogs)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const savedBlogs = await testHelper.getAllBlogsDb()
    const content = savedBlogs.map(b => b.title)
    assert(content.includes('this is a new blog post'))
    assert(savedBlogs.length, testHelper.listWithMultipleBlogs + 1)
  })

  test('fail with 400 if data is invalid', async () => {
    const newNote = { title: 'test' }

    await api
      .post('/api/blogs')
      .send(newNote)
      .expect(400)

    const savedBlogs = await testHelper.getAllBlogsDb()
    assert.strictEqual(savedBlogs.length, testHelper.listWithMultipleBlogs.length)
  })

  test('likes default to zero if they don\'t exist', async () => {
    const newNote = { title: 'test', url: 'google.com' }

    const result = await api
      .post('/api/blogs')
      .send(newNote)
      .expect(201)

    assert.strictEqual(result.body.likes, 0)

    const savedBlogs = await testHelper.getAllBlogsDb()
    const saved = savedBlogs.find(b => b.id === result.body.id)
    assert.strictEqual(saved.likes, 0)
  })
})

describe('DELETE endpoint', () => {
  test('succeeds with 204 if id is valid', async () => {
    const blogsAtStart = await testHelper.getAllBlogsDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await testHelper.getAllBlogsDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const ids = blogsAtEnd.map(b => b.id)
    assert(!ids.includes(blogToDelete.id))
  })

  test('fails with 404 if blog does not exist', async () => {
    const nonExistentId = testHelper.getUniqueId()

    await api
      .delete(`/api/blogs/${nonExistentId}`)
      .expect(404)
  })
})

describe('PUT endpoint', () => {
  test('succeeds with 200 and updates the number of likes', async () => {
    const blogsAtStart = await testHelper.getAllBlogsDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedData = { ...blogToUpdate, likes: blogToUpdate.likes + 10 }

    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.likes, blogToUpdate.likes + 10)

    // Confirm the change is persisted in the DB
    const blogsAtEnd = await testHelper.getAllBlogsDb()
    const updated = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updated.likes, blogToUpdate.likes + 10)
  })

  test('fails with 404 if blog does not exist', async () => {
    const nonExistentId = testHelper.getUniqueId()

    await api
      .put(`/api/blogs/${nonExistentId}`)
      .send({ likes: 99 })
      .expect(404)
  })
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
  ]
  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    assert.strictEqual(result, 7)
  })

})

describe('favorite blog', () => {
  test('blog with the most likes', async () => {
    const blogsAtStart = await testHelper.getAllBlogsDb()
    const result = favoriteBlog(blogsAtStart)
    console.log(blogsAtStart)
    assert.strictEqual(result.title, testHelper.listWithMultipleBlogs[2].title)
  })
})

describe('most blogs', () => {
  test('author with the most blogs', async () => {
    const blogsAtStart = await testHelper.getAllBlogsDb()
    const result = mostBlogs(blogsAtStart)

    assert.deepStrictEqual(result.author, testHelper.listWithMultipleBlogs[3].author)
  })
})

describe('most likes', () => {
  test('author with the most likes', async () => {
    const blogsAtStart = await testHelper.getAllBlogsDb()
    const result = mostLikes(blogsAtStart)
    console.log(result)
    assert.deepStrictEqual(result.author, testHelper.listWithMultipleBlogs[1].author)
  })
})

after(async () => {
  await mongoose.connection.close()
})