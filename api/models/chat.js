
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
	senderId: {
		type:Schema.Types.ObjectId,
		ref: 'chatusers'
	},
	receiverId:{
		type:Schema.Types.ObjectId,
		ref: 'chatusers'
	},
	members:{
		type:Array
	},
	message:{
		type:Array
	},
	created: {
		type: Date,
		default: Date.now
	}
});

var chatObj = mongoose.model('chats', ChatSchema);
module.exports = chatObj;
