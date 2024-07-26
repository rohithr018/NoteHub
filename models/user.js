const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		require: true,
	},
	roles: [
		{
			type: String,
			default: 'Employee',
		}
	],
	active: {
		type: Boolean,
		default: true,
	},
	password: {
		type: String,
		require: true,
	},
})

module.exports = mongoose.model('user', userSchema)
