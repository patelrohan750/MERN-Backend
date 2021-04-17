const mongoose = require('mongoose');

mongoose
	.connect('mongodb://localhost:27017/MERN_Backend', {
		useCreateIndex: true,
		useNewUrlParser: true,
		useFindAndModify: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('connection sucessfull');
	})
	.catch((e) => {
		console.log('No connection');
	});
