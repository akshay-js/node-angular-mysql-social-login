const User = require('../models/user')
const jwt = require('jwt-simple')
const config = require('../config.json')

const tokenForUser = (user) => {
  const timestamp = new Date().getTime()
  // console.log("token generate", user);

  return jwt.encode({ sub: user.id, iat: timestamp }, config.JWTSECRET)
}

exports.signin = (req, res, next) => res.send({ token: tokenForUser(req.user) })

exports.loginByToken = (req, res, next) => {
 
  res.send({ data: req.user })
}

exports.unlinkFb = (req, res, next) => {
  console.log(req.query);

  User.findOne({ where: { id: req.user.id } }).then(user => {
    console.log(req.query.type);

    if (req.query.type === 'facebok') {

      user.update({
        fb_id: ''
      }).then((user) => {
        res.json({ message: 'Un-Linked', data: user })
      });
    } else {

      user.update({
        tw_id: ''
      }).then((user) => {
        res.json({ message: 'Un-Linked', data: user })
      });
    }
  })
  // res.send({ data: req.user })

}

exports.signup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    return res.status(422).send({ error: "You must provide email and password" })
  }

  User.findOne({ where: { email } }).then(existingUser => {
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' })
    }

    User.create({ email, full_name: email, password })
      .then(user1 => {
        User.findOne({ where: { email } }).then((user) => { 
          res.json({ token: tokenForUser(user) })
        })

      })
      .catch(e => next(e))
  })
}

exports.socialLogin = (req, res, next) => {
  // console.log(req.body);

  const fb_id = req.body.id;
  const email = req.body.email;
  const full_name = req.body.name;
  const image = req.body.photoUrl;

  if (!fb_id) {
    return res.status(422).send({ error: "You must provide facebook id" })
  }

  User.findOne({ where: { fb_id } }).then(existingUser => {
    if (existingUser) {
      // console.log("existingUserexistingUserexistingUserexistingUser",existingUser);

      return res.send({ token: tokenForUser(existingUser) });
    }

    User.create({ email, full_name, fb_id, image })
      .then(user1 => {
        User.findOne({ where: { email } }).then((user) => {
          res.json({ token: tokenForUser(user) })
        })

      })
      .catch(e => next(e))
  })
}

exports.linkFb = (req, res, next) => {


  const fb_id = req.body.id;
  // const email = req.body.email;
  // const full_name = req.body.name;
  const image = req.body.photoUrl;
  console.log(image);

  if (!fb_id) {
    return res.status(422).send({ error: "You must provide facebook id" })
  }

  User.findOne({ where: { fb_id } }).then(existingUser => {
    if (existingUser) {
      // console.log("existingUserexistingUserexistingUserexistingUser",existingUser);

      return res.send({ message: 'Already linked' });
    }

    User.findOne({ where: { id: req.user.id } }).then(user => {
      user.update({
        fb_id: fb_id, image
      }).then((user) => {
        res.json({ message: 'Linked', data: user, image })
      });
    })
  });
}