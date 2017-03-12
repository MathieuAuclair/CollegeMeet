
//connection to socket

var socket = io.connect();

//get queryString information

var userAccount = JSON.parse(getParameterByName("profile"));

function screenAjust(){
	if(screen.width > 500)
	guessSelect.style.height = "300px";
	else
	guessSelect.style.height = "240px";
}

//function to show description over a picture

var guessSelect = document.getElementById("aboutSelection");

function displayInfo(index){
	screenAjust();
	socket.emit("viewAccount", userAccount.email, userAccount.password, index);
	socket.on("loadView", function(valid, guessMatch){	
		var view = JSON.parse(guessMatch);
		if(valid && view != null){
		guessSelect.children[0].innerHTML = view.name;
		guessSelect.children[1].innerHTML = view.bio;
		guessSelect.children[2].innerHTML = view.tag + " tag matched";
		}
		else{
		guessSelect.children[0].innerHTML = "not availible";
		guessSelect.children[1].innerHTML = "no match availible";
		guessSelect.children[2].innerHTML = "0 tag matched";
		}
		
	});	
}

