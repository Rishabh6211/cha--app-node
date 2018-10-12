const debug = require('debug')('express-koder:server');
const http = require('http');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');


require('babel-core/register');
require('babel-polyfill');
//file imports
require('./config/mongoose');
require('./api/policies/Auth');
// var oauth2 = require('./api/policies/oauth2');
const log = require('./config/log')(module);
const routes = require('./config/routes');
const app = express();
const chatObj = require('./api/models/chat') ;
const chatuserObj = require('./api/models/chatuser');
//server.listen(process.env.PORT || 1337)
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));
app.use(passport.initialize());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  next();
});
app.use('/', routes);
// app.use('/api/oauth/token', oauth2.token);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404);
  log.debug('Not found URL: %s',req.url);
  res.json({ error: 'Not found' });
  return;
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the log error
  res.status(err.status || 500);
  log.error('Internal error(%d): %s',res.statusCode,err.message);
  res.json({ error: err.message });
  return;
});
const normalizePort = (val) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};
//Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || 1337);
app.set('port', port);
//Create HTTP server.
const server = http.createServer(app);
const io = require('socket.io')(server);
//require('./api/services/SocketService')(io, log);

//Listen on provided port, on all network interfaces.
server.listen(port);
io.sockets.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('add-message', (req) => {

          let data1 = {}
          data1.senderId = req.senderId;
          data1.receiverId = req.receiverId;
          data1.message = req.message;
          data1.members = [req.senderId,req.receiverId]

          /* let query = {
               
                     senderId: data1.senderId ,
                     receiverId: data1.receiverId 
                
            };*/
            let query = {
                $or: [
                    { members: [data1.senderId, data1.receiverId] },
                    { members: [data1.receiverId, data1.senderId] }
                ]
            };
            console.log("query",query)
          chatObj.findOne(query).then((result)=>{
            console.log("result",result)
            if(result){
              let data = {
                $push: {
                  message: {
                      senderId: data1.senderId,
                      receiverId: data1.receiverId,
                      message: data1.message,
                  }
                } 
              };
              chatObj.update(query,data).then((result1)=>{
                console.log("result",result1)
                if(result1){
                    io.emit('success', { type: 'new-message', text: data1.message, senderId: data1.senderId, receiverId: data1.receiverId })
                }
                else{
                  io.emit('error', err);
                }
              }).catch((err)=>{
                console.log("err",err)
              })
            }
            else{
              chatObj(data1).save().then((data) => {
                console.log("data",data)
              io.emit('success', { type: 'new-message', text: data1.message });
              }).catch((err)=>{
                io.emit('error', err);
              })
              
            }

          })
        
    });





socket.on('chat-1', (message) => io.emit('chat2',"Hii there "));


    socket.on('listing', (req)=> {
      console.log("inside user")
      chatuserObj.find({isActive: true}).then((data)=>{
        console.log("data************",data)
          if(data){
              io.emit('list',{"data":data})
              //res.status(200).json({"message":"all register user","data":data})
          }
          else{
              io.emit('listerr',{"meaage":"usernot listing"})
              //res.status(400).json({"message":"user not listed"})
          }
      })
    })

    socket.on('logout', (req)=>{
        let userId = req.userId
        console.log("userId",userId)
        let data = { $set: { isActive: false } };
        chatuserObj.findByIdAndUpdate(userId,data).then((result)=>{
            console.log("result",result)
            if(result){
                io.emit('loguser',{"message":"Successfully logout"})
               //res.status(200).json({"message":"logout Successfully"})
            }
            else{
                io.emit('logerr',{"meaage":"usernot logout"})
                //res.status(400).json({"message":"Some error"})
            }
        })
    
    })


});
//Event listener for HTTP server "error" event.
const onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

//Event listener for HTTP server "listening" event.
const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log('Listening on ' + bind);
};

server.on('error', onError);
server.on('listening', onListening);

//export default app;