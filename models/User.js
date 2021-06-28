var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	transactions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Transaction'
		}
	]
});

module.exports = mongoose.model('User', userSchema);
