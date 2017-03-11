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


//fake database here

var users = [];

//object to store users

function user(n, e, p){
this.name = n,
this.email = e,
this.password = p,
this.bio,
this.friend
}

io.sockets.on('connection', function(socket){
	//connection
	console.log("new connection");

	//disconnect
	socket.on('disconnect', function(data){
	console.log("connection released");
	});

	socket.on('createAccount', function(newName, newEmail, newPassword){
	var newUser =  new user(newName, newEmail, newPassword);
	if(newUser.name.length > 2)
		users.push(newUser);
	else
		io.sockets.emit('error', true);
	console.log(newUser);
	});

	socket.on('logInAccount', function(email, password){
	var currentUser;
	console.log("try");
	for(i = 0; i < users.length; i++){
		if(users[i].email == email)
			currentUser = users[i];
		}
	if(currentUser.password == password)
		console.log("connected user on account!");
	else
		console.log("error connection for a user");
	});
});




