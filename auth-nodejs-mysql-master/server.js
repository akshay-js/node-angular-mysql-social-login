const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const passport = require('passport');

const session = require('express-session');

const router = require('./router')


var https = require('https');

var http = require('http');

var fs = require('fs');

// Please pass the ca, cert, key file path here
// var options = {
//   ca: [fs.readFileSync(PATH_TO_BUNDLE_CERT_1), fs.readFileSync(PATH_TO_BUNDLE_CERT_2)],
//   cert: fs.readFileSync(PATH_TO_CERT),
//   key: fs.readFileSync(PATH_TO_KEY)
// };

const config = require('./config.json');


const app = express()
var cors = require('cors');
// const { config } = require('process');

app.use(cors())

app.use(express.static('public'))
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});



const TwitterStrategy = require('passport-twitter').Strategy;

const TWITTER_APP_ID = config.TWITTER_APP_ID;
const TWITTER_APP_SECRET = config.TWITTER_APP_SECRET;

console.log(config.twitterCallBAckUrl);

passport.use(new TwitterStrategy({
  consumerKey: TWITTER_APP_ID,
  consumerSecret: TWITTER_APP_SECRET,
  callbackURL: config.twitterCallBAckUrl
},
  function (token, tokenSecret, profile, cb) {
    userProfile = profile;
    return cb(null, profile);
  }
));



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))

router(app)

//app.listen(process.env.PORT || 80, () => console.log('Listening....'))

  // var server = https.createServer(options, app);  //Please un-comment it when you add the cert files

  var server = http.createServer(app);
  
    server.listen(4000, function(){
        console.log("server running at port 80/")
    });
