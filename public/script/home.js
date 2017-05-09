//connection to socket

var socket = io.connect();

//store daily match
var dailyMatch = [];

//store the chosen match
var currentSelectedMatch;

//store the current user
var currentUserInfo;

$(document).ready(function(){
	var currentSession = getJsonFromUrl();
	var selection = document.getElementById("selection");
	$.post("http://localhost:8080/getLiveSession", {"id":getJsonFromUrl().id}, function(data){
		if(data == ""){
		alert("sorry, there was an error, please log again!");
		window.location.href = "http://localhost:8080";
		}
		else{
			currentUserInfo = data;
			$.post("http://localhost:8080/getDailyMatch", {"email":currentUserInfo.EMAIL,"password":currentUserInfo.PASSWORD}, function(data){
			if(data === "false"){
			alert("sorry, there was an error, please log again");
			window.location.href = "http://localhost:8080";
			}
			else if(data === "true"){
			document.getElementById("state").innerHTML = "sorry no more match today..."
			document.getElementById("content").children[0].innerHTML = "Maybe later!";
			}
			else{
				dailyMatch = data; //store local the result
				for(i = 0; i < selection.children.length; i++){
					if(dailyMatch[i].IMGPROFILE != null){
						selection.children[i].src = dailyMatch[i].IMGPROFILE;
						}
					}
				}
			});
		}
	});
});

function getJsonFromUrl() {
	var query = location.search.substr(1);
	var result = {};
	query.split("&").forEach(function(part) {
		var item = part.split("=");
		result[item[0]] = decodeURIComponent(item[1]);
	});
	return result;
}


var noAnimationInProcess = true;
var firstTimeAnim = true;

function getMoreInfoOnProfile(matchViewId){
	currentSelectedMatch = dailyMatch[matchViewId].EMAIL;
	var time = 1500;
	if(firstTimeAnim){
	firstTimeAnim = false;
	time = 0;
	}
	if(dailyMatch.length > 0 && noAnimationInProcess){
	var about = document.getElementById("aboutSelection");
		about.style.height = "0px";
		noAnimationInProcess = false;
		setTimeout(function(){	
		about.children[0].innerHTML = dailyMatch[matchViewId].NAME;
		about.children[1].innerHTML = dailyMatch[matchViewId].BIO;
		about.children[2].innerHTML = "not available";
		about.style.height = "400px";
		noAnimationInProcess = true;
		}, time);
	}
	else if(dailyMatch.length <= 0){
	alert("sorry no match availible at this time!");
	}
}


$("#addFriend").click(function(){
	if(currentSelectedMatch == null){
	alert("select a match before pressing this button");
	}
	else{
		$.post("http://localhost:8080/addFriend", {"email":currentSelectedMatch, "user":currentUserInfo.EMAIL, "password":currentUserInfo.PASSWORD}, function(data){
			if(data == "true"){
				alert("friend added!");
				$.post("http://localhost:8080/createLiveSession", currentUserInfo, function(data){
				window.location.href = "http://localhost:8080/homePage.html?id=" + data;
				});
			}
			else{
			alert("there was a problem while adding friend, please try later...");
			}
		});
	}
});
