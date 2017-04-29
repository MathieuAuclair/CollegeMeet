var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var bodyParser = require("body-parser");
var mysql = require("mysql");
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password : '*********',
	database : 'MEETME'
});

connection.connect(function(err){
	if(err){
	console.log("error while connecting to database");
	console.log(err.code);
	}
});

//function that query database

function queryDatabase(userQuery){
	connection.query(userQuery, function(err, result){
		if(err){
			throw err;
		}
		console.log(result);
	});
}

//node js server setup

server.listen(process.env.PORT || 8080);
console.log("Server is running on localhost:8080\n*\n*\n*");

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
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
app.post('/signin', function(request, response){
	var query = "SELECT * FROM MEMBER";
	if(queryDatabase(query) == null){
	response.end("not found", 404);
	}
	else{
	console.log("succes");
	response.end("request found", 200);
	}
});

app.post('/login', function(request, accountInfo, response){
	console.log(request.body.email);
});

app.post('/CountMembers', function(request, response){
	response.end(online.toString(), 200);
});

