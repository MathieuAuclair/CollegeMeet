
//set connection to the socket

//var socket = io('http://localhost:8080');

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

//form content object

function newAccountInfo(){
this.name = document.getElementById("newName").value,
this.email = document.getElementById("newEmail").value,
this.password = document.getElementById("newPassword").value
}

function accountInfo(){
this.email = document.getElementById("logEmail").value,
this.password = document.getElementById("logPassword").value
}


//send form

$("#signInBtn").click(function(){
	account = new newAccountInfo();
	if(validateAccount(account)){
		$.post("http://localhost:8080/signin", account, function(data){
			if(data=="true"){
				alert("account has been created!");
			}
			else{
				alert("sorry this email is already occupied...");
			}
		});
	}
	else{
		alert("please enter valid email and no special characters\n# / * < > ' ");
	}
});

$('#loginBtn').click(function(){
	$.post("http://localhost:8080/login", new accountInfo(), function(data){
		if(data == "false"){
		alert("wrong password or username, please try again!");
		}
		else{
		window.location.href = "http://localhost:8080/homePage.html?id=" + data;
		}
	});
});

//Used to count online member

$(document).ready(function(){
	$.post("http://localhost:8080/CountMembers", function(data){
		document.getElementById("counter").innerHTML = data + " online member";
	});
});

function validateAccount(account) {
	    var emailReg= /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
	    var normalReg= /^[A-Za-z0-9-_!]/
	    return(emailReg.test(account.email)&&normalReg.test(account.name)&&normalReg.test(account.password));
}
