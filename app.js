var express = require('express')
  , bodyParser = require('body-parser')
  , mongoose = require('mongoose')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

//server.listen(8080);
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
   // var addr = http.address();
    //console.log("Server listening at", addr.address + ":" + addr.port);
});


// Connect to MongoDB bsoftbala
//mongoose.connect('mongodb://learn_test:learn_test@ds011369.mlab.com:11369/learn_test');
mongoose.connect('mongodb://learn_test:learn_test@ds037262.mlab.com:37262/learn');

app.use(express.static(__dirname + '/demo'));

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization");
    next();
});
// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/demo/index.html');
});

// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['room1','room2','room3'];

var users = require('./routes/users');


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/users', users);

/* var chat = io.of('/recharge').on('connection', function(socket){    
    console.log("a new connection establish @ " +socket.id); 
	
}); */
app.get('/roomSize', function(req, res, next){                
    var paperId = req.param('paperId');    
    // http://stackoverflow.com/a/25028902/2616818
    // var clients = io.sockets.adapter.rooms[paperId];     
    var clients = io.of('/recharge').adapter.rooms[paperId];        
    var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;
    var roomMember = [];    
    for (var clientId in clients ) {        
     //this is the socket of each client in the room.
        var clientSocket = io.of('/recharge').connected[clientId];
        //you can do whatever you need with this
        // clientSocket.emit('new event', "Updates");        
        console.log(clients);
        //roomMember.push(clientSocket.userId);
    };

    res.send({
        roomSize: numClients,
        roomMember: roomMember
    });    
}); 
var recharge = io.of('/login').on('connection', function(socket){    
    console.log("a new connection establish login@ " +socket.id); 
	socket.on('join', function(data) {    
		console.log('joined'+data.userId);
	});
});

var chat = io.of('/recharge').on('connection', function(socket){    
    console.log("a new connection establish @ " +socket.id); 
	
	socket.on('join', function(data) {    
		console.log('joined'+data.userId);
        
		
		socket.userID = data.userID;
		socket.roomId = data.roomId;
		

		usernames[data.userId] = data.userId;

		var clients = io.of('/recharge').adapter.rooms[data.roomId];       
        var numClients = (typeof clients !== 'undefined') ? Object.keys(clients).length : 0;        
        if(numClients>1){
        	socket.emit('roomfull', data.userID, data , 'try another room');
        	return false;
        }
    	socket.join(data.roomId);
        data.roomSize = numClients;
       console.log(data);
        //update in his chat window
        socket.emit('joined', data.userID, data , 'you have connected to ');
        //update all chat window in this rrom
        socket.broadcast.to(data.roomId).emit('joined', data.userID, data,  ' has connected to this room');
        console.log("on Join : " + socket.id + " | userId : " +socket.userId);
    });
	// when the user disconnects.. perform this
	/*socket.on('disconnect', function(data){
		console.log(socket.userId+ ' leaved from' + data.roomId );
		// remove the username from global usernames list
		delete usernames[socket.userId];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});*/
	
	socket.on('disconnect', function(data){
		console.log(socket.id);
		if (io.sockets.connected[socket.id]) {
		    io.sockets.connected[socket.id].disconnect();
		}
		
		socket.leave(socket.roomId);
	});
	
	
	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		
		console.log('user added'+ username);
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		socket.room = 'room1';
		// add the client's username to the global list
		usernames[username] = username;
		// send client to room 1
		socket.join('room1');
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected to room1');
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'room1');
	});
	
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});
	
	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
	});
	

	
});
