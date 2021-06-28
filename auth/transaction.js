var express = require('express');
var Transaction = require('../models/Transaction');
var User = require('../models/User');
var verifyToken = require('../auth/verifyToken');
var router = express.Router();
router.use(express.json());

router.put('/create-transaction', verifyToken, (req, res, next) => {
	var { amount, text, category } = req.body;
	var userId = req.userId;

	User.findById(userId, (err, user) => {
		if (err) return res.status(500).send('There was an error finding this user!');
		if (!user) return res.status(422).send('User does not exist!');

		Transaction.create(
			{
				amount,
				text,
				category,
				userId
			},
			(err, newTransaction) => {
				if (err) return res.status(500).send('There was an error adding this transaction!');
				var newArr = [];

				for (let i = 0; i < user.transactions.length; i++) {
					newArr.push(user.transactions[i]);
				}
				newArr = [newTransaction._id, ...newArr];
				user.transactions = newArr;
				user.save().then((result) => {
					User.findById(userId)
						.populate({
							path: 'transactions',
							populate: { path: 'transactions' }
						})
						.exec((err, user) => {
							if (err) return res.status(500).send('Server error!!');
							res.status(200).send(user);
						});
				});
			}
		);
	});
});
router.get('/get-transactions', verifyToken, (req, res, next) => {
	var userId = req.userId;

	Transaction.find({ userId: userId }, (err, transactions) => {
		if (err) return res.status(500).send({ msg: 'An error occured while finding the transactions!', err });

		res.status(200).send({ transactions });
	});
});

router.delete('/transaction/:transactionId', verifyToken, (req, res, next) => {
	var { transactionId } = req.params;
	var userId = req.userId;

	User.findById(userId, (err, user) => {
		if (err) return res.status(500).send('There was an error finding this user!');
		if (!user) return res.status(404).send('User does not exist!');

		var updatedTransactions = user.transactions.filter((item) => item.toString() !== transactionId.toString());

		user.transactions = updatedTransactions;
		user.save();

		Transaction.findByIdAndRemove(transactionId, (err, transaction) => {
			if (err) return res.status(500).send('There was an error finding this transaction!');
			if (!transaction) return res.status(404).send('Transaction does not exist!');

			res.status(201);
		});
		User.findById(userId)
			.populate({
				path: 'transactions',
				populate: { path: 'transactions' }
			})
			.exec((err, transactions) => {
				if (err) return res.status(500).send('Server error!!');
				res.status(200).send(transactions);
			});
	});
});

module.exports = router;
