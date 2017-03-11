
//connection to socket

var socket = io.connect("http://localhost:8080");

//client side javascript

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

//connection with socket.io


