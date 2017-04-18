


$("#signInButton").click(function(){
	
});

$('#login').click(function(){

});

//Used to count online member

$(document).ready(function(){
	var message;
	$.post("http://localhost:8080/CountMembers", function(data){
		document.getElementById("counter").innerHTML = data + " online member";
	});
});

