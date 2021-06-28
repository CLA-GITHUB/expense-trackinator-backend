var mongoose = require('mongoose');

mongoose
	.connect(process.env.mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
	.then(() => console.log('mongo connected'));
