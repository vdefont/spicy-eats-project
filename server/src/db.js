const mysql = require('mysql2')
const config = require('./config')
const connection = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  database: config.db.database
})

function query(query, customError = "") {
  return new Promise(function(resolve, reject) {
    connection.query(query, function(err, results, fields) {
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
