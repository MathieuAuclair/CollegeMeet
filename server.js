var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var bodyParser = require("body-parser");
var mysql = require("mysql");
//var Promise = require("promise");
//var fs = require("fs");
//var CryptoJS = require("crypto-js");
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password : 'AUCM12099709',
	database : 'MEETME'
});

//list of live connection
var online = [];

connection.connect(function(err){
	if(err){
	console.log("error while connecting to database");
	console.log(err.code);
	}
});

//function that query database

//function queryDatabase(userQuery){
//	return new Promise((resolve,reject) => {
//        	connection.query(userQuery, function(err, result){
//			if(err){
//			reject(err);
//			}
//			resolve(result);
//		}); 
//	}); 
//}

//node js server setup

server.listen(process.env.PORT || 8080);
console.log("Server is running on localhost:8080\n*\n*\n*");

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static("public"));

//socketIO

var onlineUser = 0;

io.sockets.on("connection", function(socket){
	//connection
	onlineUser++;
	//disconnect
	socket.on("disconnect", function(data){
	onlineUser--;
	});

	socket.on('sendNotification', function (data) {
		console.log("message");
		socket.emit('notification', data);
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
//	Promise.all([
//	queryDatabase("SELECT EMAIL FROM MEMBER WHERE EMAIL = '"+request.body.email+"'")
//	])
//	.then((result) => response.end(createNewAccount(request.body, result[0].length)))
//	.catch((err) => console.log(err));

	connection.query("SELECT EMAIL FROM MEMBER WHERE EMAIL = '"+request.body.email+"'", function(err, result){
		if(result.length === 0 && validateAccount(request.body)){
			console.log("new account created!");
			connection.query("INSERT INTO MEMBER (EMAIL, NAME, BIRTH, GENDER, IMGPROFILE, BIO, PASSWORD, LASTMATCH) "+
				 "VALUES ("+
				 "'" + request.body.email + "', "+
				 "'" + request.body.name  + "', "+
				 "NULL, NULL, NULL, NULL, "+
				 "'" + request.body.password + "', "+
				 "'2017-01-01')", function(err, result){
				if(err){
					console.log(err.code);
					console.log("line 94");
				}
				else{
					response.send("true");
				}

			});
		}
		else{
			response.end();
		}
	});
});

//function createNewAccount(user, researchLength){
//	if(researchLength === 0 && validateAccount(user)){
//	queryDatabase("INSERT INTO MEMBER (EMAIL, NAME, BIRTH, GENDER, IMGPROFILE, BIO, PASSWORD, LASTMATCH) " + 
//		      "VALUES ('"+user.email+"','"+user.name+"',NULL,NULL,NULL,NULL,'"+user.password+"','2017-00-00');"
//		      );
//	console.log("new user created");
//	return "true";
//	}
//	else{
//	return "false";
//	}
//}

app.post('/getFriendList', function(request, response){
	connection.query("SELECT ID_FRIEND FROM FRIEND WHERE ID_MEMBER = '" + request.body.EMAIL + "';",function(err, result){
		if(err){
		throw err;
		}
		else{
		response.send(result);
		}
	});
});

app.post('/sendMessage', function(request, response){ //super unsafe... well... this homework is due for next class... 
						      //wich is in 3h from now.. fair enough!! Congrat to myself! 
	connection.query("INSERT INTO MESSAGE SET "+
			 "ID_MEMBER = '" + request.body.user + "', "+
			 "ID_FRIEND = '" + request.body.friend + "', "+
			 "CONTENT = '" + request.body.content + "', "+
			 "SENDER = '" + request.body.user + "', "+
			 "TIMESENT = NOW();",
			 function(err, result){
			 	if(err){
				throw err;
				}
				else{
				response.send("ok");
				}
			 });
});

app.post('/getConvo', function(request, response){
	var user = JSON.parse(request.body.user);
	connection.query("SELECT CONTENT, SENDER FROM MESSAGE WHERE "+
			 "("+
			 "ID_FRIEND = '" + user.EMAIL + "' "+
			 "OR "+
			 "ID_MEMBER = '" + user.EMAIL + "' "+
			 ") "+
			 "AND "+
			 "("+
			 "ID_FRIEND = '" + request.body.email + "' "+
			 "OR "+
			 "ID_MEMBER = '" + request.body.email + "' "+
			 ") "+
			 "AND "+
			 "ID_MEMBER IN "+
			 "("+
			 "SELECT EMAIL FROM MEMBER WHERE EMAIL = '" + user.EMAIL + "' "+
			 "AND "+
			 "PASSWORD = '" + user.PASSWORD + "'"+
			 ") "+
			 "OR "+
			 "ID_FRIEND IN "+
			 "("+
			 "SELECT EMAIL FROM MEMBER WHERE EMAIL = '" + user.EMAIL + "' "+
			 "AND "+
			 "PASSWORD = '" + user.PASSWORD + "'"+
			 ") "+
			 "ORDER BY TIMESENT;",
	function(err, resultMsg){
		if(err){
		throw err;
		}
		else{
		response.send(resultMsg);		 
		}
	});
});


app.post('/login', function(request, response){
	connection.query("SELECT * FROM MEMBER WHERE EMAIL = '"+request.body.email + 
			 "' AND PASSWORD = '" + request.body.password + "'", function(err, result){
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

app.post("/createLiveSession", function(request, response){
	connection.query("SELECT EMAIL FROM MEMBER WHERE PASSWORD = '" 
			+ request.body.PASSWORD + "' AND EMAIL = '" 
			+ request.body.EMAIL + "'", function(err, result){
		if(err){
			throw err;
		}
		var sessID = utf8_to_b64(online.length.toString() + request.body.EMAIL);
		online[online.length] = new liveSession(request.body.EMAIL, sessID);
		response.send(sessID);
	});
});

function utf8_to_b64(str){
	var base64 = new Buffer(str);
	base64 = base64.toString('base64');
	return base64.replace(/=/g, '');//remove the 2 last == so it won't break my code later on
}

//function hashSessionId(id) {
//	return CryptoJS.HmacSHA1(id, serverHashKey);
//}

function liveSession(userEmail, userID){
this.sessionID = userID;
this.email = userEmail;
}

app.post('/getLiveSession', function(request, response){
	var userSession = "";
	for(i=0; i<online.length; i++){
		if(online[i].sessionID == request.body.id){
			userSession = online[i].email; //get current session user
			online.splice(i,1);
			break;
		}
	}
	connection.query("SELECT * FROM MEMBER WHERE EMAIL = '" + userSession + "'", function(err, result){
		if(err){
		throw err;
		}
		response.send(result[0]);
	});
});

app.post('/CountMembers', function(request, response){
	response.send(onlineUser.toString());
});

app.post('/addFriend', function(request, response){
	if(request.body != null){
		connection.query("SELECT TIMESTAMPDIFF(HOUR, LASTMATCH,NOW()) "
			       + "FROM MEMBER "
			       + "WHERE EMAIL = '" + request.body.user + "' " 
			       + "AND PASSWORD = '" + request.body.password + "'",function(err, resultUser){
			if(err){
			throw err;
			}
			else if(resultUser.lenght === 0){
			console.log("Empty query launched... ?")
			response.send("false");
			}
			else if(resultUser[0]["TIMESTAMPDIFF(HOUR, LASTMATCH,NOW())"] < 24){
			response.send("false");
			}
			else{
				//UPDATE MEMBER SET LASTMATCH = CURDATE() WHERE EMAIL = 'math@mail.com';
				connection.query("UPDATE MEMBER SET LASTMATCH = CURDATE() WHERE EMAIL = '" + request.body.user + "'",
				function(errUpdate, set){
					if(errUpdate){
					throw err;
					}
					connection.query(
					"INSERT INTO FRIEND "+
					"SET ID_MEMBER = '"+request.body.user+"', "+
					"ID_FRIEND = '"+request.body.email+"';",
					function(err,result){
						if(err){
						throw err;
						}
						console.log("new friend request");
						response.send("true");
					});
				});
			}
		});
	}
});

app.post('/getDailyMatch', function(request, response){
	var user = request.body;
	if(user == null){
		console.log("error loading user info");
		response.send("false");
	}
	else{
		connection.query("SELECT TIMESTAMPDIFF(HOUR, LASTMATCH,NOW()) "
			       + "FROM MEMBER "
			       + "WHERE EMAIL = '" + user.email + "' " 
			       + "AND PASSWORD = '" + user.password + "'",function(err, resultUser){
			if(err){
			console.log("error while loading timestamp l.175")
			console.log(err.code);
			}
			else if(resultUser[0]["TIMESTAMPDIFF(HOUR, LASTMATCH,NOW())"] < 24){
			response.send("true");
			}
			else if(user != null){
				connection.query("SELECT * FROM DAILYMATCH WHERE EMAIL !='" + user.email
						+ "' AND EMAIL NOT IN ("
						+ "SELECT ID_FRIEND FROM FRIEND "
						+ "WHERE ID_MEMBER = '" + user.email + "'"
						+ ")"
					       	+ "ORDER BY LASTMATCH LIMIT 3", function(err, resultmatch){
					if(err){
					console.log("error while loading match view");
					console.log(err.code);
					}
					else{
					response.send(resultmatch);
					}
				});
			}
		});
	}
});

app.post("/updateBio", function(request, response){
	connection.query("UPDATE MEMBER SET BIO='"+request.body.bio+"' WHERE EMAIL = '" + request.body.email + "';", function(err,result){
	//UPDATE TableName SET   ValueName=@parameterName  WHERE
	//IdName=@ParameterIdName
	response.send("ok");
	});
});

app.post("/updateImage", function(request, response){
	connection.query("UPDATE MEMBER SET IMGPROFILE='"+request.body.id+"' WHERE EMAIL = '" + request.body.email + "';", function(err,result){
	//UPDATE TableName SET   ValueName=@parameterName  WHERE
	//IdName=@ParameterIdName
	response.send("ok");
	});
});
