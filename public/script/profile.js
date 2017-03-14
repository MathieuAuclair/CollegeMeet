//connect to socket

var socket = io.connect();

//change profile
var onlineUser =  JSON.parse(getParameterByName("profile"));
var urlImg = document.getElementById("content").children[3];
var image = document.getElementById("content").children[1];
var bio = document.getElementById("content").children[6];

document.getElementById("titleName").innerHTML = name.innerHTML = onlineUser.name;
image.src = onlineUser.image;
bio.value = onlineUser.bio;

function chgProfile(modif, value){
socket.emit("modifProfile", onlineUser.password, onlineUser.email, modif, value);
}

function chgImg(){
image.src = urlImg.value;
chgProfile(0, urlImg.value);
urlImg.value = "";
}

function chgBio(){
if(bio.value.length >= 350)
	chgProfile(1, bio.value);
else
	alert("your bio is over 350 character");
}
