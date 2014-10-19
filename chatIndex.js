var static = require('node-static');
var file = new(static.Server)('./chatIndex.html');

var http = require('http');
var io = require('socket.io')(http);

var app = http.createServer(function (req, res) {
    file.serve (req, res);
}).listen(2013);

var webSocket = io.listen(app);

webSocket.on('connection', function(socket){
    socket.on('disconnect', function(){
        console.log('User disconnected');
        socket.broadcast.emit('chat message', 'A user has disconnected');
    });
    socket.on('myName', function(name){
        console.log(name + " has connected");
        socket.broadcast.emit('new user', name);
        userList.push(name);
    });
    socket.on('chat message', function(msg){
        console.log(msg);
        socket.broadcast.emit('chat message', msg);
    });
    socket.on('start writing', function(name){
        socket.broadcast.emit('start writing', name);
    });
    socket.on('stop writing', function(name){
        socket.broadcast.emit('stop writing', name);
    });
});

console.log('Server ready in localhost:2013');
