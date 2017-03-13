//connect to socket

var socket = io.connect();

var message = document.getElementById("writeArea").children[0];
var conversation = document.getElementById("convo");

function sendMsg(){
conversation.innerHTML += "<p class='send'>" + message.value + "</p>";
message.value = "";
}
