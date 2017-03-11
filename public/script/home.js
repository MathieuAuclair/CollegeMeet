
//connection to socket

var socket = io.connect();

//get queryString information


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

var userAccount = getParameterByName("profile");
console.log(JSON.parse(userAccount).name); 
function loadFiles(){
socket.emit("loadProfile");
}
