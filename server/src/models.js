// SET UP MODEL

const dataTypes = {
  shortString: 0,
  string: 1,
  longString: 2,
  int: 3,
  smallDouble: 4,
  bit: 5,
  image: 6
}
const sqlTypes = {}
sqlTypes[dataTypes.shortString] = "varchar(50)"
sqlTypes[dataTypes.string] = "varchar(255)"
sqlTypes[dataTypes.longString] = "text"
sqlTypes[dataTypes.int] = "int"
sqlTypes[dataTypes.smallDouble] = "double(2,1)"
sqlTypes[dataTypes.image] = "varchar(50000)"
sqlTypes[dataTypes.boolean] = "bit"
const quoteTypes = [
  dataTypes.shortString,
  dataTypes.string,
  dataTypes.longString,
  dataTypes.image
]

var model = {}  // Will contain all the tables

// Add tables to model
// Standard fields not included: createdAt, updatedAt (end)
// If primary key not specified, assumed to be id
function addTables() {

  model.cities = {
    fields: {
      name: dataTypes.string
    }
  }

  model.restaurants = {
    fields: {
      name: dataTypes.string,
      citiesId: dataTypes.int,
      address: dataTypes.string,
      cuisines: dataTypes.string,
      spiciness: dataTypes.smallDouble,
      overallQuality: dataTypes.smallDouble,
      reviews: dataTypes.int,
      website: dataTypes.string,
      phoneNumber: dataTypes.string,
      acceptsReservations: dataTypes.string
    }
  }

  model.cuisines = {
    fields: {
      name: dataTypes.shortString
    },
    primaryKey: "name"
  }

  model.restaurants_x_cuisines = {
    fields: {
      restaurantsId: dataTypes.int,
      cuisinesName: dataTypes.shortString
    },
    unique: ["restaurantsId", "cuisinesName"]
  }

  model.reviews = {
    fields: {
      restaurantsId: dataTypes.int,
      usersId: dataTypes.string,
      dishesEaten: dataTypes.string,
      spiciness: dataTypes.int,
      overallQuality: dataTypes.int,
      description: dataTypes.longString
    }
  }

  model.photos = {
    fields: {
      reviewsId: dataTypes.int,
      caption: dataTypes.string,
      photo: dataTypes.image
    }
  }

  model.users = {
    fields: {
      username: dataTypes.shortString,
      salt: dataTypes.string,
      password: dataTypes.string,
      name: dataTypes.string,
      email: dataTypes.string,
      photo: dataTypes.image,
      location: dataTypes.string,
      age: dataTypes.int,
      favoriteCuisines: dataTypes.string,
      about: dataTypes.longString,
      reviews: dataTypes.int
    },
    primaryKey: "username"
  }

}

// Add "id" as primary key for all fields where it was left blank
function addPrimaryKey() {
  for (table in model) {
    if (!("primaryKey" in model[table]) && !("unique" in model[table])) {
      model[table].primaryKey = "id"
      model[table].fields.id = dataTypes.int
    }
  }
}

// Run functions to set up model
addTables()
addPrimaryKey()

// UTILITY QUERIES TO CREATE TABLES

// Makes query for CREATE TABLE
function getCreateTableQuery(table) {

  curModel = model[table]
  curFields = curModel.fields
  curPrimaryKey = curModel.primaryKey
  curUnique = curModel.unique

  fieldsArr = []
  if (curPrimaryKey && curPrimaryKey == "id") fieldsArr.push("id INT NOT NULL AUTO_INCREMENT")
  for (field in curFields) {
    if (field != "id") {
      type = curFields[field]
      sqlType = sqlTypes[type]
      curFieldStr = `${field} ${sqlType}`
      fieldsArr.push(curFieldStr)
    }
  }
  fieldsArr.push("createdAt datetime")
  fieldsArr.push("updatedAt datetime")
  if (curPrimaryKey) fieldsArr.push(`PRIMARY KEY (${curPrimaryKey})`)
  else if (curUnique) fieldsArr.push(`UNIQUE (${curUnique.join()})`)
  fieldsStr = fieldsArr.join(", ")

  query = `CREATE TABLE ${table} (${fieldsStr});`
  return(query)
}

// Makes all queries for CREATE TABLE
function printCreateTableQueries() {
  for (table in model) {
    query = getCreateTableQuery(table)
    console.log(query)
  }
}


// QUERIES FOR INCOMING REQUESTS

// Operations: getAll, find, create, update, delete
function makeStandardQuery(table, operation, reqBody) {
  curModel = model[table]
  curFields = curModel.fields

  // Get all
  if (operation == "getAll") {
    query = `SELECT * FROM ${table}`
  }

  // Find an element by certain fields given in request
  else if (operation == "find") {
    wherePairs = [] // Elements have format "username = 'x'"

    for (key in reqBody) {
      if (key in curFields) {
        val = reqBody[key]
        if (quoteTypes.indexOf(curFields[key]) >= 0) {
          curPair = `${key} = '${val}'`
        } else {
          curPair = `${key} = ${val}`
        }
        wherePairs.push(curPair)
      }
    }

    whereQuery = wherePairs.join(" AND ")
    if (whereQuery != "") {
      whereQuery = " WHERE " + whereQuery
    }

    query = `SELECT * FROM ${table}${whereQuery}`
  }

  // Create an element
  else if (operation == "create") {
    keys = ["createdAt","updatedAt"]
    vals = ["NOW()","NOW()"]
    for (key in reqBody) {
      if (key in curFields) {
        val = reqBody[key]
        keys.push(key)
        // If it is a string, add quotes around it
        if (quoteTypes.indexOf(curFields[key]) >= 0) val = `'${val}'`
        vals.push(val)
      }
    }
    keysStr = keys.join(",")
    valsStr = vals.join(",")
    query = `INSERT INTO ${table} (${keysStr}) VALUES (${valsStr})`
  }

  // Update an element
  else if (operation == "update") {

    // Get primary key
    primaryKey = curModel.primaryKey
    primaryVal = reqBody[primaryKey]
    if (quoteTypes.indexOf(curFields[primaryKey]) >= 0) primaryVal = `'${primaryVal}'`

    // Get fields to update
    setClauseArr = ["updatedAt = NOW()"] // Change "updatedAt" field
    for (key in reqBody) {
      if (key in curFields & key != primaryKey) {
        val = reqBody[key]
        if (quoteTypes.indexOf(curFields[key]) >= 0) val = `'${val}'`
        curClause = `${key} = ${val}`
        setClauseArr.push(curClause)
      }
    }

    // Make query
    setClauseStr = setClauseArr.join(", ")
    query = `UPDATE ${table} SET ${setClauseStr} WHERE ${primaryKey} = ${primaryVal}`

  }

  // Delete an element
  else if (operation == "delete") {
    primaryKey = curModel.primaryKey
    primaryVal = reqBody[primaryKey]
    if (quoteTypes.indexOf(curFields[primaryKey]) >= 0) primaryVal = `'${primaryVal}'`
    query = `DELETE FROM ${table} WHERE ${primaryKey} = ${primaryVal}`
  }

  return(query)
}


module.exports = {
  makeStandardQuery: makeStandardQuery
}
