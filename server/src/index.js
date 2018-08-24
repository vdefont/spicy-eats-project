const cors = require('cors') // Accepts requests from anywhere
const bodyParser = require('body-parser') // Decode JSON
const fs = require('fs') // Access file system - for logging
const morgan = require('morgan') // Logging

const express = require('express')
const config = require('./config')
const models = require('./models')
const db = require('./db')
const security = require('./security')

var app = express()
app.use(cors())
app.use(bodyParser.json())

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream('serverAccess.log', {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))

// Make sure that requests are coming from website, not from tool like postman
function verifyRequestOrigin(req, res, next) {
  var headers = req.headers
  var properRequest = (
    headers.origin && headers.origin.indexOf("burninghotfood") >= 0 &&
    headers.referer && headers.referer.indexOf("burninghotfood") >= 0
  )
  if (properRequest) next()
  else res.send("Error: malicious request! Go home hacker!")
}
if (!config.dev) app.use(verifyRequestOrigin)

// Replace all single-quotes with double-single quotes: ' -> ''
// Useful for SQL
function replaceSingleQuotes(req, res, next) {
  var body = req.body
  var newBody = {}
  for (var key in body) {
    var val = body[key]
    // If string, replace single quotes with two single quotes
    if (typeof(val) == 'string') val = val.replace(/'/g, "''")
    newBody[key] = val
  }
  req.body = newBody
  next()
}
app.use(replaceSingleQuotes)

// Ex: /standardQuery/users/getAll
app.post('/standardQuery/:table/:operation', async function (req, res) {

  // Make query
  var table = req.params.table
  var operation = req.params.operation
  var query = models.makeStandardQuery(table, operation, req.body)

  // Execute query
  var results = await db.query(query)
  res.send(results)
})

// Given: username, password
// Adds to db: username, salt, password (hashed)
// Returns error if username exists
app.post('/createUser', async function (req, res) {

  user = req.body
  passwordUnhashed = user.password

  // Create salt and hashed password
  salt = security.getSalt()
  user.salt = salt
  try {
    passwordHashed = await security.hashPassword(salt, passwordUnhashed)
    user.password = passwordHashed
  } catch (err) {
    res.send({error: "Error hashing password"})
    return
  }

  // Insert into database
  query = models.makeStandardQuery('users', 'create', user)
  results = await db.query(query, customError = "User already exists")
  res.send(results)
})

// Given: username, password
// Gets from db: salt, password (hashed)
// Checks if salted & hashed password equals to password stored in db
app.post('/validateUser', async function (req, res) {

  user = req.body
  username = user.username
  passwordUnhashed = user.password

  // Get salt and real hashed password
  query = models.makeStandardQuery('users', 'find', {username: username})
  results = await db.query(query)
  // If user doesn't exist, ensure validation will fail
  // We still make it do validation, so that user can't tell if username or password was wrong
  if (results.error || results.length == 0) {
    salt = security.getSalt()
    realHashedPassword = ""
  } else {
    user = results[0]
    salt = user.salt
    realHashedPassword = user.password
  }

  // Check if user input matches
  try {
    hashedPassword = await security.hashPassword(salt, passwordUnhashed)
  } catch (err) {
    res.send({error: "Error hashing password"})
    return
  }
  if (hashedPassword != realHashedPassword) res.send({error: "Username or password incorrect"})
  else res.send({name: user.name})

})

// reviews or forumPosts
// - reviews: includes "user" and "photos" fields
app.post('/getPosts/:table', async function (req, res) {
  var table = req.params.table // 'reviews' or 'forumPosts'

  // Find all posts (by restaurant, or by parent)
  var getPostsQuery = models.makeStandardQuery(table, 'find', req.body)
  var postsIncomplete = await db.query(getPostsQuery)

  // Add "user" and "photos" fields
  // Add "restaurant" field if restaurantId is null (use case: "my account" page)
  var postsComplete = []
  for (var i in postsIncomplete) {
    var post = postsIncomplete[i]

    // Add user
    var userQuery = models.makeStandardQuery('users', 'find', {username: post.usersId})
    var user = (await db.query(userQuery))[0]
    // Delete protected fields
    if (user) {
      delete user.salt
      delete user.password
      delete user.email
    }

    post.user = user

    // Add photos
    var idObject = {}
    idObject[`${table}Id`] = post.id
    var photosQuery = models.makeStandardQuery('photos', 'find', idObject)
    var photos = await db.query(photosQuery)
    post.photos = photos

    // For reviews, add restaurant if not already in query
    if (table === 'reviews' && !req.body.restaurantId) {
      var restaurantQuery = models.makeStandardQuery('restaurants', 'find', {
        id: post.restaurantsId
      })
      var restaurant = (await db.query(restaurantQuery))[0]
      post.restaurant = restaurant
    }

    // Save post
    postsComplete.push(post)
  }

  res.send(postsComplete)
})

// table: reviews, or forumPosts
async function addPhotos (table, postId, photos) {
  for (var i in photos) {
    var photo = photos[i]
    photo[`${table}Id`] = postId
    if (photo.id) {
      var updatePhoto = {}
      updatePhoto.id = photo.id
      updatePhoto.caption = photo.caption
      var query = models.makeStandardQuery('photos', 'update', updatePhoto)
    } else {
      var query = models.makeStandardQuery('photos', 'create', photo)
    }
    await db.query(query)
  }
}

// Adds review and recalculates average spiciness for restaurant
// Operation: create or update
app.post('/reviews/:operation', async function (req, res) {
  var review = req.body

  // Add review
  var query = models.makeStandardQuery('reviews', req.params.operation, review)
  var result = (await db.query(query))

  // Add photos
  var reviewsId = review.id ? review.id : result.insertId // get review id
  await addPhotos('reviews', reviewsId, review.photos)

  // Recalculate spiciness, overallQuality, reviews
  var restaurantsId = review.restaurantsId
  query = `SELECT AVG(spiciness) AS spiciness, AVG(overallQuality) AS overallQuality, COUNT(id) AS reviews FROM reviews WHERE restaurantsId = ${restaurantsId}`
  result = (await db.query(query))[0]
  var round = (val) => Math.round(val * 10) / 10 // Round to 1 decimal place
  var spiciness = round(result.spiciness)
  var overallQuality = round(result.overallQuality)
  var reviews = round(result.reviews)

  // Update spiciness, overallQuality, reviews
  query = `UPDATE restaurants SET spiciness = ${spiciness}, overallQuality = ${overallQuality}, reviews = ${reviews} WHERE id = ${restaurantsId}`
  await db.query(query)

  // Recalculate num of user reviews
  var usersId = review.usersId
  query = `SELECT COUNT(id) AS reviews FROM reviews WHERE usersId = '${usersId}'`
  result = (await db.query(query))[0]
  reviews = result.reviews

  // Update user's reviews
  query = `UPDATE users SET reviews = ${reviews} WHERE username = '${usersId}'`
  await db.query(query)

  res.send()
})

// Add or update forumPost, recalculate replies for parent (unless parent is 0, which means it's a topic)
// Operation: create or update
app.post('/forumPosts/:operation', async function (req, res) {
  var forumPost = req.body
  var operation = req.params.operation

  // create or update post
  var query = models.makeStandardQuery('forumPosts', operation, forumPost)
  var result = (await db.query(query))
  var insertId = result.insertId

  // If creating and parent is 0, set root to own id
  if (operation === 'create' && forumPost.parent === 0) {
    query = models.makeStandardQuery('forumPosts', 'update', {
      id: insertId,
      root: insertId
    })
    await db.query(query)
  }

  // Add photos
  var forumPostsId = forumPost.id ? forumPost.id : insertId // get review id
  await addPhotos('forumPosts', forumPostsId, forumPost.photos)

  // Update replies count if creating
  if (operation == 'create') {

    // recalculate posts for users
    var usersId = forumPost.usersId
    var query = `SELECT count(id) AS posts FROM forumPosts WHERE usersId = '${usersId}'`
    var result = (await db.query(query))
    var posts = result[0].posts
    // update posts for users
    query = `UPDATE users SET forumPosts = ${posts} WHERE username = '${usersId}'`
    await db.query(query)

    // recalculate replies for parent
    var parentId = forumPost.parent
    var isTopic = parentId == 0
    if (!isTopic) {
      query = `SELECT COUNT(id) AS replies FROM forumPosts WHERE parent = '${parentId}'`
      result = (await db.query(query))
      var replies = result[0].replies
      // update replies for parent
      query = `UPDATE forumPosts SET replies = ${replies} WHERE id = '${parentId}'`
      await db.query(query)
    }
  }

  res.send()
})

// Adds cuisine to restaurant
app.post('/addCuisineToRestaurant', async function (req, res) {

  var body = req.body
  var cuisinesName = body.cuisinesName
  var restaurantsId = body.restaurantsId

  // Add cuisine if it doesn't exist yet
  var query = `REPLACE INTO cuisines (name) VALUES ("${cuisinesName}")`;
  await db.query(query);

  // Replace into restaurants_x_cuisines table
  query = 'REPLACE INTO restaurants_x_cuisines (restaurantsId, cuisinesName) ' +
    `VALUES (${restaurantsId}, "${cuisinesName}")`;
  await db.query(query);

  // Get cuisines, update restaurant cuisines listing
  query = `SELECT cuisinesName FROM restaurants_x_cuisines WHERE restaurantsId = ${restaurantsId}`
  var results = await db.query(query)
  var cuisines = [];
  for (var i = 0; i < results.length; i += 1) {
    var curCuisine = results[i].cuisinesName
    cuisines.push(curCuisine)
  }
  var cuisinesStr = cuisines.join(', ')

  // Update restaurant with new cuisines string
  var restaurant = {
    id: restaurantsId,
    cuisines: cuisinesStr
  }
  query = models.makeStandardQuery('restaurants', 'update', restaurant)
  await db.query(query)

  res.send({})
})

app.listen(config.port)
