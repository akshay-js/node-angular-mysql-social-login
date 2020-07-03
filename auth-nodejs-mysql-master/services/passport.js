const User = require('../models/user')
const bcrypt = require('bcrypt')

const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')


const localOptions = { usernameField: 'email' }

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {

  User.findOne({ where: { email } }).then((user) => {
    if (!user) return done(null, false)


    //  let t =  await new Promise((resolve, reject) => {
    //   bcrypt.genSalt(10, (err, salt) => {
    //     if (err) { reject(err) }

    //     return bcrypt.hash(password, salt, null, (err, hash) => {
    //       if (err) { reject(err) }
    //         // user.password = hash
    //         resolve(hash)
    //     })
    //   })
    // })

    // console.log(t);
    console.log(user);

    user.comparePassword(password, (err, isMatch) => {
      if (err) return done(err)
      // console.log(user.password, email, password, isMatch);

      if (!isMatch) return done(null, false)
      return done(null, user)
    })
  }).catch(e => done(e))
})

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.JWTSECRET,
}

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // console.log("payload", payload);

  User.findById(payload.sub)
    .then(user => user ? done(null, user) : done(null, false))
    .catch(e => done(err, false))
})

module.exports = {
  jwt: jwtLogin,
  local: localLogin
}
