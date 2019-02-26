var counter = 0, errors = [];
class Text{
	constructor(text){
		this.sender = text.match(/\]\s(Sydney|Isabella):/g)[0].replace("] ", "").replace(":", "");
		this.date = text.match(/\d\d\.\d\d\.\d\d/g)[0];
		this.time = text.match(/\d:\d\d:\d\d\s(AM|PM)/g)[0];
		this.message = text.match(/\]\s(Sydney|Isabella):\s[^]*/g)[0].replace(/\]\s(Isabella|Sydney):\s/g, "");
	}
}

function getFile(evt) {
    var file = evt.target.files[0];
    if (file) {
        var r = new FileReader();
        r.onload = function(e) {
            var contents = e.target.result;
            text = r.result;
            splitToObjects(text);
        }
        r.readAsText(file);
    } else {
        alert("Failed to load file");
    }
}

function splitToObjects(text){
	var allTexts = text.split(/\[/g), output = [];
	allTexts.forEach(function(val){
		if(val.match(/\d\d\.\d\d\.\d\d,\s\d{1,2}:\d\d:\d\d\s(AM|PM)\]\s(Sydney|Isabella):\s[^]*/g)){
			output.push(new Text(val));
		}else{
			errors.push(val);
		}
	});

	//console.log(output);
	//console.log(errors)
	parseOutput(output);
}

function parseOutput(output){
	resultsBella = {
		messages: 0,
		averageMessage: 0,
		averageWords: 0,
		charsTyped: 0,
		wordsTyped: 0
	}

	resultsSydney = {
		messages: 0,
		averageMessage: 0,
		averageWords: 0,
		charsTyped: 0,
		wordsTyped: 0
	}

	output.forEach(function(val){
		if (val !== "Bild weggelassen" && val !== "Nachrichten in diesem Chat sowie Anrufe sind jetzt mit Ende-zu-Ende-Verschlüsselung geschützt."){
			if (val.sender === "Sydney"){
				resultsSydney.messages++;
				resultsSydney.charsTyped += val.message.length;

				let words = val.message.split(" ");
				resultsSydney.wordsTyped += words.length;
			}else if (val.sender === "Isabella"){
				resultsBella.messages++;
				resultsBella.charsTyped += val.message.length;

				let words = val.message.split(" ");
				resultsBella.wordsTyped += words.length;
			}
		}

		resultsSydney.averageMessage = resultsSydney.charsTyped/resultsSydney.messages; //average characters per message
		resultsSydney.averageWords = resultsSydney.wordsTyped/resultsSydney.messages; //average words per message

		resultsBella.averageMessage = resultsBella.charsTyped/resultsBella.messages; //average characters per message
		resultsBella.averageWords = resultsBella.wordsTyped/resultsBella.messages; //average words per message
	})

	document.getElementById("output").innerHTML = 

	"<h1>Sydney:</h1><br>Amount of messages: " + resultsSydney.messages + 
		"<br>Average characters per message: " + resultsSydney.averageMessage +
			  "<br>Average words per message " + resultsSydney.averageWords +
					  "<br>Characters typed: " + resultsSydney.charsTyped +
						   "<br>Words typed: " + resultsSydney.wordsTyped +

	"<h1>Bella:</h1><br>Amount of messages: " + resultsBella.messages + 
	   "<br>Average characters per message: " + resultsBella.averageMessage +
			 "<br>Average words per message " + resultsBella.averageWords +
				     "<br>Characters typed: " + resultsBella.charsTyped +
				   	      "<br>Words typed: " + resultsBella.wordsTyped;

	//console.log(resultsSydney)
	//console.log(resultsBella)
}

document.getElementById("file").addEventListener("change", getFile, false)