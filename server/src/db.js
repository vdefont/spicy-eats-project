const mysql = require('mysql2')
const maria = require('mariasql');
const config = require('./config')

const connectionParams = {
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database
}

try {
  const connection = mysql.createConnection(connectionParams)
} catch (e) {
  const connection = new maria(connectionParams)
}

function query(query, customError = "") {
  return new Promise(function(resolve, reject) {
    connection.query(query, function(err, results) {
      if (err) {
        if (customError != "") err = customError
        results = {error: err}
      }
      resolve(results)
    })
  })
}

module.exports = {
  query: query
}
