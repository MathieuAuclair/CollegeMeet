

//accessAccount('/profile.html?profile=', false);

function getParameterByName(name, url) {
	if (!url) 
		url = window.location.href;

	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//check if entry are right
function accessAccount(pathTo, fromIndex){
if(fromIndex)
socket.emit("logInAccount", logEmail.value, logPassword.value);
else{
account = JSON.parse(getParameterByName("profile"));
socket.emit("logInAccount", account.email, account.password)
}
socket.on ('loadHome', function(valid, currentUser){
	if(valid)
	window.location.href = pathTo + JSON.stringify(currentUser); 
	});
}


