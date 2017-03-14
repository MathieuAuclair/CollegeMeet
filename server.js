var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);


//node js server setup

server.listen(process.env.PORT || 8080);
console.log("Server is running on localhost:8080\n*\n*\n*");

app.use(express.static("public"));

//fake database here

var users = [];

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

//object to store friend view

function friend(e, n, b, t) {
this.email = e,
this.name = n,
this.bio = b,
this.tag = t
}

//count of online person

var online = 0;

io.sockets.on('connection', function(socket){
	//connection
	online++;	
	console.log(online + " connection");
	//disconnect
	socket.on('disconnect', function(data){
	online--;
	console.log(online + " connection");
	});

	socket.on('createAccount', function(newName, newEmail, newPassword){
	var newUser =  new user(newName, newEmail, newPassword);
	if(newUser.name.length > 5 && checkRegex(newUser.name) && newUser.password.length > 5 && checkRegex(newUser.password) && distinct(newUser.email)){
		users.push(newUser);
		io.sockets.emit('error', false);
	}
	else
		io.sockets.emit('error', true);
	});

	socket.on('logInAccount', function(email, password){
		if(idChecker(email,password))
		io.emit('loadHome', true, getUser(email,password));
	});

	socket.on('viewAccount', function(email, password, index){
	if(idChecker(email,password)&&getUser(email,password).match[index]!=null)
		io.emit('loadView', true, JSON.stringify(getUser(email,password).match[index]));	
	else
		io.emit('loadView', false, "no match availible");
	});
	socket.on('modifProfile', function(password, email, modif, value){
	if(idChecker(email, password)){
		var currentUser = getUser(email, password);
		switch(modif){
			case 0:
				currentUser.image = value;
				break;
			case 1:
				currentUser.bio = value;
				break;
			}
		}
	});
});


function checkRegex(string){
var regex = /[^a-zA-Z0-9-_@ ]/g;
var regexValid = true,
    str = string.match(regex);
if(str!=null)
if(str[0]!=null)
	regexValid = false;
return regexValid;
}



function idChecker(email, password){
	var currentUser;
	for(i = 0; i < users.length; i++){
	if(users[i].email == email)
		currentUser = users[i];
		}
	if(currentUser != null)
	if(currentUser.password == password){
	return true;
	}
	return false;
}

function getUser(email, password){
	var currentUser;
	for(i = 0; i < users.length; i++){
	if(users[i].email == email)
		currentUser = users[i];
		}
	if(currentUser != null)
	if(currentUser.password == password){
	return currentUser;
	}
	return null;
}

function distinct(email){
	for(i=0; i<users.length; i++){
		if(users[i].email == email)
			return false;
	}
	return true;
}

function modifProfile(email, password, modif, modifValue){
if(idChecker(email,password)){
	var currentUser = getUser(email,password);
	switch(modif){
		case 0:
			currentUser.image = modifValue;
			break;
		case 1:
			if(checkRegex(currentUser.bio)&&currentUser.bio.length < 350)
			currentUser.bio = modifValue;
			break;
		}
	}
}





