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
chgProfile(0, urlImg.value);
accessAccount('/profile.html?profile=', false);
}

function chgBio(){
if(bio.value.length < 350){
	chgProfile(1, bio.value);
	accessAccount('/profile.html?profile=', false);
}
else
	alert("your bio is over 350 character");
}

//get every checked input

var tagBox = document.getElementById("tagBox");
var tagList = [];

function updateTag(){
	for(i = 0; i < tagBox.children.length/2; i++){
		if(tagBox.children[i*2+1].checked){
			tagList[tagList.length] = tagBox.children[i*2].innerHTML;	
		}
	}
if(tagList.length > 6)
	alert("maximum of 5 tag");		
}



