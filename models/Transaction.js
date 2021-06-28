var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const transactionSchema = new Schema(
	{
		amount: {
			type: Number,
			required: true
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		text: {
			type: String,
			required: true
		},
		category: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('Transaction', transactionSchema);
