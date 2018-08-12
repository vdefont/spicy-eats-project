const cors = require('cors') // Accepts requests from anywhere
const bodyParser = require('body-parser') // Decode JSON
const morgan = require('morgan') // Logging

const express = require('express')
const config = require('./config')
const models = require('./models')
const db = require('./db')
const security = require('./security')

var app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('combined'))

// Ex: /standardQuery/users/getAll
app.post('/standardQuery/:table/:operation', async function (req, res) {

  // Make query
  var table = req.params.table
  var operation = req.params.operation
  var query = models.makeStandardQuery(table, operation, req.body)
  if (table != "photos") console.log(query)

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

// Adds review and recalculates average spiciness for restaurant
app.post('/addReview', async function (req, res) {
  // Add review
  var query = models.makeStandardQuery('reviews', 'create', req.body)
  var result = (await db.query(query))
  var insertId = result.insertId

  // Recalculate spiciness, overallQuality, reviews
  var restaurantsId = req.body.restaurantsId;
  query = `SELECT AVG(spiciness) AS spiciness, AVG(overallQuality) AS overallQuality, COUNT(id) AS reviews FROM reviews WHERE restaurantsId = ${restaurantsId}`
  result = (await db.query(query))[0]
  var round = (val) => Math.round(val * 10) / 10 // Round to 1 decimal place
  var spiciness = round(result.spiciness)
  var overallQuality = round(result.overallQuality)
  var reviews = round(result.reviews)

  // Update spiciness, overallQuality, reviews
  query = `UPDATE restaurants SET spiciness = ${spiciness}, overallQuality = ${overallQuality}, reviews = ${reviews} WHERE id = ${restaurantsId}`
  console.log(query)
  await db.query(query)

  res.send({
    insertId: insertId
  })
})

// Returns reviews, including "user" and "photos" fields
app.post('/getReviews', async function (req, res) {
  // Get all reviews for specified restaurant
  var getReviewsQuery = models.makeStandardQuery('reviews', 'find', req.body)
  var reviewsIncomplete = await db.query(getReviewsQuery)

  // Add "user" and "photos" fields
  var reviewsComplete = []
  for (var i in reviewsIncomplete) {
    var review = reviewsIncomplete[i]

    // Add user - but only name field
    var userQuery = models.makeStandardQuery('users', 'find', {usename: review.usersId})
    var user = (await db.query(userQuery))[0]
    review.user = {name: user.name}

    // Add photos
    var photosQuery = models.makeStandardQuery('photos', 'find', {reviewsId: review.id})
    var photos = await db.query(photosQuery)
    review.photos = photos

    // Save review
    reviewsComplete.push(review)
  }

  res.send(reviewsComplete)
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
