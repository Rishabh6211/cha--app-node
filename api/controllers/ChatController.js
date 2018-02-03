/*import express from 'express';
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
module.exports = {

	chatApp : (req,res) => {
		io.on('connection', function(socket){
		  console.log('user connected');
		  res.status(200).json("connected")
		  socket.on('chat message', function(msg){
		    io.emit('chat message', msg);
		  });
		  socket.on('disconnect', function(){
		    console.log('user disconnected');
		  });
		});
	}

   
};*/