
//connection to socket

var socket = io.connect();

//POST


//GET

$(document).ready(function(){
	var message;
	$.post("http://localhost:8080/CountMembers", function(data){
		alert(data);
	});
});

