var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

//var mysql = require("mysql");
//mysql.createConnection(function(){


//});

//node js server setup

server.listen(process.env.PORT || 8080);
console.log("Server is running on localhost:8080\n*\n*\n*");

app.use(express.static("public"));

//object to store users

function user(n, e, p){
this.name = n,
this.email = e,
this.password = p,
this.bio = "",
this.friend = [],
this.match = [],
this.tag = [],
this.time = 0,
this.image = "";
}

//count of online person

var online = 0;

io.sockets.on("connection", function(socket){
	//connection
	online++;	
	console.log(online + "connection");
	//disconnect
	socket.on("disconnect", function(data){
	online--;
	console.log(online + "connection");
	});
});

//POST

app.post('/CountMembers', function(request, response){
	console.log("Request recived!");
	response.send(online.toString(), 200);
});

