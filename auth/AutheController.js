var express = require('express');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var router = express.Router();
router.use(express.json());
var User = require('../models/User');
var Transaction = require('../models/Transaction');

router.post('/signup', (req, res) => {
	const { name, email, password } = req.body;

	const hashedPassword = bcrypt.hashSync(password, 12);

	User.create({ name: name, email: email, password: hashedPassword }, (err, user) => {
		if (err) return res.status(500).send({ msg: 'There was a problem registering this user!' });

		var token = jwt.sign({ id: user.id }, process.env.jwt_secret, { expiresIn: 86400 });

		User.findOne({ email })
			.populate('transactions')
			.exec((err, user) => {
				if (err) return res.status(500).send('There was an error finding this user!');
				res.status(200).json({
					auth: true,
					token: token,
					user: { email: user.email, name: user.name, transactions: user.transactions, _id: user._id }
				});
			});
	});
});

router.post('/login', (req, res) => {
	const { email, password } = req.body;

	User.findOne({ email }, (err, user) => {
		if (err) return res.status(500).send('There was an error finding this user!');
		if (!user) return res.status(404).send('User does not exist!');

		var isPasswordValid = bcrypt.compareSync(password, user.password);
		if (!isPasswordValid) return res.status(401).send('Password incorrect!');

		var token = jwt.sign({ id: user.id }, process.env.jwt_secret, { expiresIn: 86400 });
		User.findOne({ email })
			.populate('transactions')
			.exec((err, user) => {
				if (err) return res.status(500).send('There was an error finding this user!');
				res.status(200).json({
					auth: true,
					token: token,
					user: { email: user.email, name: user.name, transactions: user.transactions, _id: user._id }
				});
			});
	});
});

module.exports = router;
