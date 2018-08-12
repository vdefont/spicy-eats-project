const rand = require('csprng') // Random numbers for salting
const crypto = require('crypto') // Hashing function

const NUM_HASHED_BYTES = 64;
const ITERS = 100000; // Higher number -> slower hash function

function getSalt () {
  salt = rand(2 * NUM_HASHED_BYTES, 36) // 160 random letters & numbers
  return(salt)
}

function hashPassword (password, salt) {
  return new Promise(function(resolve, reject) {
    crypto.pbkdf2(password, salt, ITERS, NUM_HASHED_BYTES, 'sha512', (err, derivedKey) => {
      if (err) reject(err)
      else resolve(derivedKey.toString('hex')) // Convert buffer (bytes) to hex string
    })
  })
}

module.exports = {
  getSalt: getSalt,
  hashPassword: hashPassword
}
