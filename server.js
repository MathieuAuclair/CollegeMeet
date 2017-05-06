var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var bodyParser = require("body-parser");
var mysql = require("mysql");
var Promise = require("promise");
//var fs = require("fs");
//var CryptoJS = require("crypto-js");
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password : 'AUCM12099709',
	database : 'MEETME'
});

var online = [];

//var serverHashKey = "123";

connection.connect(function(err){
	if(err){
	console.log("error while connecting to database");
	console.log(err.code);
	}
});

//function that query database

function queryDatabase(userQuery){
	return new Promise((resolve,reject) => {
        	connection.query(userQuery, function(err, result){
			if(err){
			reject(err);
			}
			resolve(result);
		}); 
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

//socketIO

io.sockets.on("connection", function(socket){
	//connection
	
	//disconnect
	socket.on("disconnect", function(data){
	
	
	});
});

/*
delete from orders 
where id_users = 1 and id_product = 2
limit 1
*/


function validateAccount(account) {
	    var emailReg= /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
	    var normalReg= /^[A-Za-z0-9-_!]/
	    return(emailReg.test(account.email)&&normalReg.test(account.name)&&normalReg.test(account.password));
}

//POST
app.post('/signin', function(request, response){
	Promise.all([
	queryDatabase("SELECT EMAIL FROM MEMBER WHERE EMAIL = '"+request.body.email+"'")
	])
	.then((result) => response.end(createNewAccount(request.body, result[0].length)))
	.catch((err) => console.log(err));
});

function createNewAccount(user, researchLength){
	if(researchLength === 0 && validateAccount(user)){
	queryDatabase("INSERT INTO MEMBER (EMAIL, NAME, BIRTH, GENDER, IMGPROFILE, BIO, PASSWORD) " + 
		      "VALUES ('"+user.email+"','"+user.name+"',NULL,NULL,NULL,NULL,'"+user.password+"');"
		      );
	console.log("new user created");
	return "true";
	}
	else{
	return "false";
	}
}

app.post('/login', function(request, response){
	connection.query("SELECT * FROM MEMBER WHERE EMAIL = '"+request.body.email+ "' AND PASSWORD = '" + request.body.password + "'", function(err, result){
		if(err){
		console.log("error while login");
		console.log(err.code);
		}
		else if(result.length === 0){
		response.send("false");
		}
		else{
		var session = utf8_to_b64(connection.length + request.body.email);
		online[online.length] = (new liveSession(request.body.email, session));
		response.send(session);
		}

	});
});

function utf8_to_b64(str){
	var base64 = new Buffer(str);
	console.log(base64.toString('base64'));
	return base64.toString('base64');
}

//function hashSessionId(id) {
//	return CryptoJS.HmacSHA1(id, serverHashKey);
//}

function liveSession(userEmail, userID){
this.sessionID = userID;
this.email = userEmail;
}

app.post('/CountMembers', function(request, response){
	console.log(online.length);
	response.end(online.length.toString());
});


