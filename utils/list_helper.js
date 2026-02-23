// const dummy = (array) => {
//   return 1
// }

const totalLikes = (array) => {
  return array[array.length - 1].likes
}

const favoriteBlog = (array) => {
  let i
  let mostLikes = 0
  let mostLikesIndex = 0
  let presentLikes = 0
  for (i = 0; i < array.length; i++){
    if (i === 0) {
      mostLikes = array[i].likes
      mostLikesIndex = i
      continue
    }
    presentLikes = array[i].likes
    if (presentLikes > mostLikes){
      mostLikes = presentLikes
      mostLikesIndex = i
    }
  }
  return array[mostLikesIndex]
}

const itemCheck = (array, string) => {
  if (array.length === 0){
    return false
  }

  for (let i = 0; i < array.length; i++){
    if (string === array[i]){
      return true
    }
  }
  return false
}

const mostBlogs = (array) => {

  let authors = []
  let authorsPlain = []

  for (let i = 0; i < array.length; i++){
    if (itemCheck(authorsPlain, array[i].author)){
      continue
    }
    let obj = {
      author: array[i].author,
      numberofPosts: 0
    }
    authors.push(obj)
    authorsPlain.push(array[i].author)
  }


  for (let i = 0; i < authors.length; i++){
    let authorName = authors[i].author
    for (let j = 0; j < array.length; j++){
      if (authorName === array[j].author){
        authors[i].numberofPosts++
      }
    }
  }

  let maxPostsCurrent = 0
  let maxPostsIndex = 0
  let presentNumberPost = 0

  for (let i = 0; i < authors.length; i++){
    if (i === 0){
      maxPosts = authors[i].numberofPosts
      maxPostsIndex = i
      continue
    }
    presentNumberPost = authors[i].numberofPosts
    if (presentNumberPost > maxPostsCurrent){
      maxPostsCurrent = presentNumberPost
      maxPostsIndex = i
    }
  }

  return authors[maxPostsIndex]
}

module.exports = {
//   dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}