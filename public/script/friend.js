//connect to socket

var socket = io.connect('http://localhost:8080');

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

var currentTalk = "";
var currentTalkId = 0;

socket.on("notification", function(data){
	if(data.to == currentUserInfo.EMAIL && data.from == currentTalk){
		getFriend(currentTalkId);
	}	
});

function getFriend(friendId){
	currentTalkId = friendId;
	currentTalk = friendholder.children[friendId].innerHTML;
	$.post("http://localhost:8080/getConvo", 
	{'user':JSON.stringify(currentUserInfo), 'email':friendholder.children[friendId].innerHTML},
	function(data){
		messageBox.innerHTML = "";
		for(i=0;i<data.length;i++){
			var from;
			if(data[i].SENDER == currentUserInfo.EMAIL){
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

var messageContainer = document.getElementById("writeArea").children[0];

$("#sendMsg").click(function(){
	$.post("http://localhost:8080/sendMessage", {"content":messageContainer.value,
						     "user":currentUserInfo.EMAIL,	
						     "friend":currentTalk
						    },function(data){
							    console.log("from:"+currentUserInfo.EMAIL+"\nto:"+currentTalk);
	messageBox.innerHTML += "<p class='send'>" + messageContainer.value + "</p>";
	messageContainer.value = "";
	});
	
	socket.emit("sendNotification", {"from":currentUserInfo.EMAIL, "to":currentTalk});
});
