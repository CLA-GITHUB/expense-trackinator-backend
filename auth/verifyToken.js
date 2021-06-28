var jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	var token = req.headers['x-access-token'];

	if (!token) return res.status(403).send('No token provided');

	jwt.verify(token, process.env.jwt_secret, (err, decoded) => {
		if (err) return res.status(500).send('An error occured while trying to authenticate the token');

		req.userId = decoded.id;
		next();
	});
};

module.exports = verifyToken;
