//connection to socket

var socket = io.connect();

//store daily match
var dailyMatch = [];

$(document).ready(function(){
	var currentSession = getJsonFromUrl();
	var selection = document.getElementById("selection");
	$.post("http://localhost:8080/getDailyMatch", {id:currentSession.id}, function(data){
		if(data == "false"){
		alert("there was an error, please log again");
		window.location.href = "http://localhost:8080";
		}
		else if(data == "true"){
		document.getElementById("state").innerHTML = "sorry no more match today..."
		}
		else{
			dailyMatch = data; //store local the result
			console.log(dailyMatch);
			for(i = 0; i < selection.children.length; i++){
				if(dailyMatch[i].IMGPROFILE != null){
				selection.children[i].src = dailyMatch[i].IMGPROFILE;
				}
			}
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

function getMoreInfoOnProfile(matchViewId){
	if(dailyMatch.length > 0){
	var about = document.getElementById("aboutSelection");
	about.children[0].innerHTML = dailyMatch[matchViewId].NAME;
	about.children[1].innerHTML = dailyMatch[matchViewId].BIO;
	about.children[2].innerHTML = "not availible";
	}
	else{
	alert("sorry no match availible at this time!");
	}
}
