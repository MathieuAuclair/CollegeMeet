//connect to socket

var socket = io.connect();

//current user info

var currentUserInfo;

//friend index holder

var friendholder = document.getElementById("contact").children[0];

$(document).ready(function(){
	$.post("http://localhost:8080/getLiveSession", {"id":getJsonFromUrl().id}, function(dataUser){
		if(dataUser.length == 0){
		alert("sorry, there was an error, please log again");
		window.location.href = "http://localhost:8080";
		}
		else{
			currentUserInfo = dataUser;
			$.post("http://localhost:8080/getFriendList", currentUserInfo, function(data){
				for(i=0;i<data.length;i++){
				friendholder.innerHTML += "<li onclick='getFriend(" + i + ")'>"+data[i].ID_FRIEND+"</li>";
				}
			});
		}
	});
});

var messageBox = document.getElementById("convo");

function getFriend(friendId){
	$.post("http://localhost:8080/getConvo", 
	{'user':JSON.stringify(currentUserInfo), 'email':friendholder.children[friendId].innerHTML},
	function(data){
		messageBox.innerHTML = "";
		for(i=0;i<data.length;i++){
			var from;
			if(data[i].SENDER === currentUserInfo.EMAIL){
			from = "send";
			}
			else{
			from = "recive";
			}

			messageBox.innerHTML += "<p class='"+from+"'>"+data[i].CONTENT+"</p>";
		}
	});
}

function getJsonFromUrl() {
	var query = location.search.substr(1);
	var result = {};
	query.split("&").forEach(function(part) {
		var item = part.split("=");
		result[item[0]] = decodeURIComponent(item[1]);
	});
	return result;
}
