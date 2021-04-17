const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const employeeSchema = new mongoose.Schema({
	firstname: {
		type: String,
		required: true
	},
	lastname: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: [ true, 'invalid email' ]
	},
	gender: {
		type: String,
		required: true
	},
	phone: {
		type: Number,
		required: true,
		unique: [ true, 'invalid phone number' ]
	},
	age: {
		type: Number,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	confirmpassword: {
		type: String,
		required: true
	},
	tokens: [
		{
			token: {
				type: String,
				required: true
			}
		}
	]
});

//genrating tokens
employeeSchema.methods.generateAuthToken = async function() {
	try {
		const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRECT_KEY);
		this.tokens = this.tokens.concat({ token: token });
		await this.save();
		return token;
	} catch (e) {
		console.log(e);
	}
};

//converting password into hash
employeeSchema.pre('save', async function(next) {
	if (this.isModified('password')) {
		console.log(`before hashing Pasword is: ${this.password}`);
		this.password = await bcrypt.hash(this.password, 10);
		console.log(`After hashing Pasword is: ${this.password}`);
		this.confirmpassword = await bcrypt.hash(this.password, 10);
	}
	next();
});

const Register = new mongoose.model('Registers', employeeSchema);

module.exports = Register;
