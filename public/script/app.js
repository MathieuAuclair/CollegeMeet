
//set connection to the socket

var socket = io('http://localhost:8080');

//button html style

$("#signInButton").click(function(){
	$("#login").animate({
		width:"0px",
		height:"0px"
	});
	
	$("#signup").animate({
		height:"300px",
		width:"100%"
	});
});


$("#logInButton").click(function(){
	$("#signup").animate({
		width:"0px",
		height:"0px"
	});
	$("#login").animate({
		height:"300px",
		width:"100%"
	});
});

//send form

$("#signInBtn").click(function(){
	$.post("http://localhost:8080/signin", function(data){
		alert(data);
	});
});

$('#loginBtn').click(function(){
	$.post("http://localhost:8080/login", function(data){
		alert(data);
	});
});

//Used to count online member

$(document).ready(function(){
	var message;
	$.post("http://localhost:8080/CountMembers", function(data){
		document.getElementById("counter").innerHTML = data + " online member";
	});
});

