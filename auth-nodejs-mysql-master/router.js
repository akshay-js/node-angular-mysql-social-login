const Authentication = require('./controllers/authentication')
const passportStrategies = require('./services/passport')
const passport = require('passport')
const User = require("./models/user");
// const { authenticate } = require('passport');
const jwt = require('jwt-simple')

const config = require("./config.json");

passport.use(passportStrategies.jwt)
passport.use(passportStrategies.local)

const requireAuth = passport.authenticate('jwt', { session: false })
const requireSignin = passport.authenticate('local', { session: false })

module.exports = (app) => {

  app.get('/', requireAuth, (req, res) => res.send({ hi: 'there' }))
  app.post('/signup', Authentication.signup)
  app.post('/socialLogin', Authentication.socialLogin)
  app.post('/signin', requireSignin, Authentication.signin)

  app.get('/getProfile', requireAuth, Authentication.loginByToken)
  app.get('/unlinkFb', requireAuth, Authentication.unlinkFb)

  app.post('/linkFb', requireAuth, Authentication.linkFb)

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitterLink', function (req, res, next) {
    if (req.query.t) {
      var reqId = req.query.t;
      // states[reqId] = {
      //   database: 'c',
      //   age: $('input[name="creator[age]"]').val()
      // };
      // creates an unic id for this authentication and stores it.
      req.session.state = reqId;
    }
    passport.authenticate('twitter')(req, res, next);
  });

  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }),
    function (req, res) {

      var reqId = req.session.state;

      // reuse your previously saved state
      // var state = states[reqId]

      const tw_id = req.user.id;

      const image = req.user.photos[0].value;

      if (reqId) {
        req.session.state = '';
        try {
          let token = jwt.decode(reqId, config.JWTSECRET);

          User.findOne({ where: { id: token.sub } }).then(user => {
            user.update({
              tw_id: tw_id,
              twitter_image: image
            }).then((user1) => {

              return res.redirect(config.FRONT_TWITTER_REDIRECT_DASHBOARD_URL);
            });
          })
        } catch (e) {
          res.redirect(config.FRONT_TWITTER_REDIRECT_ERROR_URL+'?error="Something went wrong"');
        }
        // passport.authenticate('jwt', { session: false }

      } else {

        const email = req.user.username;
        const full_name = req.user.displayName;
        const image = req.user.photos[0].value;

        if (!tw_id) {
          return res.redirect(config.FRONT_TWITTER_REDIRECT_ERROR_URL_SIGNUP+'?error="You must provide twitter id"')
        }
        // console.log("sssssssssss",config.FRONT_TWITTER_REDIRECT_URL_SIGNUP);
        

        User.findOne({ where: { tw_id } }).then(existingUser => {
          if (existingUser) {
            return res.redirect(config.FRONT_TWITTER_REDIRECT_URL_SIGNUP+'?token=' + tokenForUser(existingUser));
          }

          User.create({
            email, full_name, tw_id,
            twitter_image: image
          })
            .then(user => {

              User.findOne({ where: { tw_id } }).then((user) => {

                res.redirect(config.FRONT_TWITTER_REDIRECT_URL_SIGNUP+'?token=' + tokenForUser(user));

              });
            })
            .catch(e => res.json(e))
        })

      }

      // Successful authentication, redirect home.
    });


  const tokenForUser = (user) => {
    const timestamp = new Date().getTime()
    return jwt.encode({ sub: user.id, iat: timestamp }, config.JWTSECRET)
  }
  app.post('/sms', (req, res) => {
    const run = smsParser(req.body.message)
    res.status(200).send({ events: [] })
  })
}