const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatuserSchema = new Schema({
	user: {
		type: String
	},
	isActive:{
		type: Boolean,
		default:false 
	},
	created: {
		type: Date,
		default: Date.now
	}
});

var chatuserObj = mongoose.model('chatusers', chatuserSchema);
module.exports = chatuserObj;
