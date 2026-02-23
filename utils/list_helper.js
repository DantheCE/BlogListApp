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
module.exports = {
//   dummy,
  totalLikes,
  favoriteBlog
}