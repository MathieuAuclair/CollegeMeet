//connect to socket

var socket = io.connect();

//store current userInformation
var currentUserInfo;

function getJsonFromUrl() {
	var query = location.search.substr(1);
	var result = {};
	query.split("&").forEach(function(part) {
		var item = part.split("=");
		result[item[0]] = decodeURIComponent(item[1]);
	});
	return result;
}

$(document).ready(function(){
	$.post("http://localhost:8080/getLiveSession", {"id":getJsonFromUrl().id}, function(data){
		if(data == ""){
		alert("sorry, there was an error, please log again!");
		window.location.href = "http://localhost:8080";
		}
		else{
			currentUserInfo = data;
		}
		
		document.getElementById("profilepic").src = currentUserInfo.IMGPROFILE;
		var bioContent = document.getElementById("bioContent");
		bioContent.value = currentUserInfo.BIO;
		
		var srcUrl = document.getElementById("srcUrl");
		srcUrl.value = currentUserInfo.IMGPROFILE;
		document.getElementById("titleName").innerHTML = currentUserInfo.NAME;

	});
});

$("#liPageHome").click(function(){
	$.post("http://localhost:8080/createLiveSession", currentUserInfo, function(data){
		window.location.href = "http://localhost:8080/homePage.html?id="+data;
	});
});

$("#liPageFriend").click(function(){
	$.post("http://localhost:8080/createLiveSession", currentUserInfo, function(data){
		window.location.href = "http://localhost:8080/friend.html?id="+data;
	});
});

$("#chgbio").click(function(){
	$.post("http://localhost:8080/updateBio", {"email":currentUserInfo.EMAIL,"bio":bioContent.value}, function(data){
		alert("bio updated!");
	});
});

$("#chgimg").click(function(){
	$.post("http://localhost:8080/updateImage", {"email":currentUserInfo.EMAIL,"id":srcUrl.value}, function(data){
		alert("image updated!");
		document.getElementById("profilepic").src = srcUrl.value; 
	});
});
