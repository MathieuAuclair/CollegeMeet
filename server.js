var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

server.listen(process.env.PORT || 8080);
console.log("Server is running on localhost:8080\n*\n*\n*");

app.use(express.static("public"));

//normal javascript function goes here





//

var userOnline = 0;

io.sockets.on("connection", function(socket){
	//connection
	userOnline++;
	console.log(userOnline + " connected users");
	
	//disconnect
	socket.on("disconnect", function(data){
		userOnline--;
		console.log(userOnline + " connected users");
	});


	/*example

	socket.on("functionName", function(object){
	//do things
	//
	//
	});

	io.emit("update", functionReturn);
	
	*/
});

