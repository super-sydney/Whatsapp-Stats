var counter = 0,
  errors = [];

texts = []
results = []
names = []


class Text {
  constructor(text) {
    try {
      this.sender = text.match(/\d\d(\.|-)\d\d(\.|-)\d\d(\d\d)?\,?\s\d\d:\d\d:\d\d(\s(AM|PM))?\]\s.+?:/g)[0]
      this.sender = this.sender.replace(/\d\d(\.|-)\d\d(\.|-)\d\d(\d\d)?\,?\s\d\d:\d\d:\d\d(\s(AM|PM))?\]\s/g, "")
      this.sender = this.sender.replace(":", "");
    } catch (error) {
      console.log(error)
      console.log(text)
    }

    if (!names.includes(this.sender)) {
      names.push(this.sender)
      results.push({
        sender: this.sender,
        messages: 0,
        averageMessage: 0,
        averageWords: 0,
        charsTyped: 0,
        wordsTyped: 0,
        times: new Array(24).fill(0)
      })
    }

    this.date = text.match(/\d\d(\.|-)\d\d(\.|-)\d\d(\d\d)?/g)[0];
    this.time = text.match(/\d:\d\d:\d\d(\s(AM|PM))?/g)[0];

    let regex1 = new RegExp("\\]\\s.+:\\s[^]*")
    let regex2 = new RegExp("\\]\\s.+:\\s")
    this.message = text.match(regex1)[0].replace(regex2, "");

    this.time = parseInt(text.match(/\d\d:/)[0].replace(":", ""));
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

function splitToObjects(text) {
  var allTexts = text.split(/\[/g);
  allTexts.forEach(function(val) {
    if (val.match(/\d\d(\.|-)\d\d(\.|-)\d\d(\d\d)?,?\s\d\d:\d\d:\d\d(\s(AM|PM))?\]\s.+:\s.*/g)) {
      texts.push(new Text(val));
    } else {
      errors.push(val);
    }
  });

  //console.log(errors)
  parseOutput(texts);
}

function parseOutput(output) {
  output.forEach(function(val) {
    let index = 0;

    for (let i = 0; i < names.length; i++) {
      if (val.sender === names[i]) {
        break;
      }
      index++;
    }

    results[index].messages++;
    results[index].charsTyped += val.message.length;

    let words = val.message.split(" ");
    results[index].wordsTyped += words.length;

    if (val.time < 24) {
      results[index].times[val.time]++;

    }
  })
  //console.log(results)

  results.forEach(function(val) {
    val.averageMessage = val.charsTyped / val.messages; //average characters per message
    val.averageWords = val.wordsTyped / val.messages; //average words per message
    document.getElementById("output").innerHTML +=
      "<h1>" + val.sender + ":</h1><br>Amount of messages: " + val.messages +
      "<br>Average characters per message: " + val.averageMessage +
      "<br>Average words per message " + val.averageWords +
      "<br>Characters typed: " + val.charsTyped +
      "<br>Words typed: " + val.wordsTyped + "<br>";
  })

  makeGraphs()
}

function makeGraphs() {
  var messageCount = document.getElementById("messageCount").getContext("2d")

  var data = {
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: []
    }],
    labels: []
  }

  results.forEach(function(val) {
    data.datasets[0].data.push(val.messages)
    let r = random(0, 255),
      g = random(0, 255),
      b = random(0, 255);
    data.datasets[0].backgroundColor.push("rgba(" + r + "," + g + "," + b + ", 0.8)")
    data.datasets[0].hoverBackgroundColor.push("rgba(" + r + "," + g + "," + b + ", 1)")
    data.labels.push(val.sender)
  })
  //var options = {}

  var graph = new Chart(messageCount, {
    type: "pie",
    data: data
    //options: options
  })
}

function random(min, max) {
  return Math.random() * (max - min) + min
}

document.getElementById("file").addEventListener("change", getFile, false)