const mysql = require('mysql2')
const maria = require('mariasql');
const config = require('./config')
const connection = new maria({
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

query('SELECT * FROM cities')
.then((output) => {
  console.log(output)
})
.catch((err) => {
  console.log(err)
})

module.exports = {
  query: query
}
