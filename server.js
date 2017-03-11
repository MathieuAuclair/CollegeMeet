var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

server.listen(process.env.PORT || 8080);
console.log("Server is running on localhost:8080\n*\n*\n*");

app.get('/',function(request, response){
response.sendFile(__dirname + '/public/index.html');	
});

app.use(express.static("public"));
//app.use( express.static(__dirname+'../client') );

//normal javascript function goes here



//

io.sockets.on('connection', function(socket){
	//connection
	console.log("new connection");

	//disconnect
	socket.on('disconnect', function(data){
	console.log("connection released");
	});
});
