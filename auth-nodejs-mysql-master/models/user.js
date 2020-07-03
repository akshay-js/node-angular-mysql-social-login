const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')
// const sequelize = new Sequelize('mysql://localhost:roor@:3310/test_db');
var sequelize = new Sequelize('nodelogin', 'root', '', {
	// mysql is the default dialect, but you know...
	// for demo purporses we are defining it nevertheless :)
	// so: we want mysql!
	dialect: 'mysql'
})
const User = sequelize.define('user', {
	email: Sequelize.STRING,
	id: {
		type: Sequelize.STRING,
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