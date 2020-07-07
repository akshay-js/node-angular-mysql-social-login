const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')
// const sequelize = new Sequelize('mysql://localhost:roor@:3310/test_db');
/*
var sequelize = new Sequelize('heroku_b7aee44bf5a419e', 'bac45569cb0114', '63548a7b', {
	// mysql is the default dialect, but you know... 
	// for demo purporses we are defining it nevertheless :)
	// so: we want mysql!
	dialect: 'mysql',
	host: 'us-cdbr-east-05.cleardb.net'
})*/

var sequelize = new Sequelize('user', 'admin', 'dsplayChris', {
	// mysql is the default dialect, but you know...
	// for demo purporses we are defining it nevertheless :)
	// so: we want mysql!
	dialect: 'mysql',
	host: 'dsplay.cxl8xst7sgm8.ca-central-1.rds.amazonaws.com'
})
const User = sequelize.define('user', {
	email: Sequelize.STRING,
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	password: Sequelize.STRING,
	fb_id: Sequelize.STRING,
	tw_id: Sequelize.STRING,
	full_name: Sequelize.STRING,
	image: Sequelize.STRING,
	twitter_image: Sequelize.STRING
}, {
	timestamps: false,
	hooks: {
		beforeCreate: (user, options) => {
			// console.log(user);
			if (user.password) {
				return new Promise((resolve, reject) => {
					bcrypt.genSalt(10, (err, salt) => {
						if (err) { reject(err) }

						return bcrypt.hash(user.password, salt, (err, hash) => {
							if (err) { reject(err) }
							user.password = hash
							resolve()
						})
					})
				});
			}
		}
	}
})

User.prototype.comparePassword = function (candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		if (err) return callback(err)

		callback(null, isMatch)
	})
}

module.exports = User