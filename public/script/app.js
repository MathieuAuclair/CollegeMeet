
//connection to socket

var socket = io.connect();

//style slide signUp logIn

var signIn = document.getElementById("signup");
var login = document.getElementById("login");

function displayLogin()
{
document.getElementById("titleh2").style.paddingTop = "10px";
signIn.style.height = "0px";
login.style.height = "290px";
}



function displaySignin()
{
document.getElementById("titleh2").style.paddingTop = "10px";
login.style.height = "0px";
signIn.style.height = "350px";
}

//create a new account to the server
var userName = document.getElementById("newName"),
    email = document.getElementById("newEmail"),
    password = document.getElementById("newPassword");

//check if entry is valid
function createAccount(){
socket.emit("createAccount", userName.value, email.value, password.value);
socket.on ('error', function(valid){
	alert("Please enter valid entry!");
	});
}

//log in an account on the server
var logEmail = document.getElementById("logEmail"),
    logPassword = document.getElementById("logPassword");

