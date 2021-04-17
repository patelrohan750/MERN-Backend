require('dotenv').config();
const express = require('express');
require('./db/conn');
const path = require('path');
const hbs = require('hbs');
const app = express();
const Register = require('./models/register');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 3000;

const staticPath = path.join(__dirname, '../public');
const templatePath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');
console.log(partialsPath);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static(staticPath));

app.set('view engine', 'hbs');
app.set('views', templatePath);
hbs.registerPartials(partialsPath);

app.get('/', (req, res) => {
	res.render('index');
});
app.get('/login', (req, res) => {
	res.render('login');
});
app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', async (req, res) => {
	try {
		const password = req.body.password;
		const cpassword = req.body.cpassword;

		if (password === cpassword) {
			const RegisterEmployee = new Register({
				firstname: req.body.fname,
				lastname: req.body.lname,
				email: req.body.email,
				gender: req.body.gender,
				phone: req.body.phone,
				age: req.body.age,
				password: password,
				confirmpassword: cpassword
			});

			const token = await RegisterEmployee.generateAuthToken();
			console.log(`after token is: ${token}`);
			//passwod hash
			// console.log('hello');
			const registered = await RegisterEmployee.save();
			console.log(registered);
			res.render('index');
		} else {
			res.send('Inavlid Details');
		}
	} catch (e) {
		res.status(400).send(e);
	}
});

app.post('/login', async (req, res) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		const useremail = await Register.findOne({ email: email });
		console.log(`user password ${password}`);

		console.log(`database password ${useremail.password}`);
		const isMatch = await bcrypt.compare(password, useremail.password);
		const token = await useremail.generateAuthToken();
		console.log(isMatch);
		console.log(token);
		if (isMatch) {
			res.render('index');
		} else {
			res.status(400).send('Invalid details');
		}
	} catch (e) {
		res.status(400).send('invalid deatils');
	}
});
app.listen(port, () => {
	console.log(`running at port ${port}`);
});
