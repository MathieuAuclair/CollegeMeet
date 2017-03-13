//connect to socket

var socket = io.connect();

//change profile

var urlImg = document.getElementById("content").children[3];
var image = document.getElementById("content").children[1];
var bio = document.getElementById("content").children[6];

document.getElementById("titleName").innerHTML = name.innerHTML = JSON.parse(getParameterByName("profile")).name;
image.src = JSON.parse(getParameterByName("profile")).image;

function chgProfile(modif, value){
socket.emit("modifProfile", JSON.parse(getParameterByName("profile")).password, JSON.parse(getParameterByName("profile")).email, modif, value);
}

function chgImg(){
image.src = urlImg.value;
chgProfile(0, urlImg.value);
urlImg.value = "";
}

function chgBio(){
chgProfile(1, bio.value);
}
