var alexa = require("alexa-app");

var app = new alexa.app("test");

app.dictionary = {
  "songs": ["Good Life", "Closer", "Shape of You", "Faded", "Stay", "Yellow"]
};

app.launch(function(request, response) {
  response.say("App launched!");
});

app.intent("weather", {
    "slots": { 
      "countries": "AMAZON.Country"
    },
    "utterances": ["{what is|how is} the weather in {-|countries}"]
  },
  function(request, response) {
    console.log('request content' + JSON.stringify(request) );
    response.say("It's sunny");
  }
);

app.intent("playMusic", {
    "slots": { 
      "SONGS": "LITERAL"
    },
    "utterances": ["play music {songs|SONGS} "]
  },
  function(request, response) {
      response.say("ok, playing "+request.slot("SONGS")+' now');
  }
);





app.intent("errorIntent", function(request, response) {
  response.say(someVariableThatDoesntExist);
});

// connect to lambda
exports.handler = app.lambda();

