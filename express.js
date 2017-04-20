var express = require("express");
var alexa = require("alexa-app");

var PORT = process.env.port || 8080;
var app = express();

// ALWAYS setup the alexa app and attach it to express before anything else.
var alexaApp = new alexa.app("test");

alexaApp.express({
  expressApp: app,

  // verifies requests come from amazon alexa. Must be enabled for production.
  // You can disable this if you're running a dev environment and want to POST
  // things to test behavior. enabled by default.
  checkCert: false,

  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production. disabled by default
  debug: true
});

// now POST calls to /test in express will be handled by the app.request() function

// from here on you can setup any other express routes or middlewares as normal
app.set("view engine", "ejs");

alexaApp.dictionary = {
  "countries": ["Taiwan", "USA", "America", "Korean", "Japan", "China"],
  "songs": ["Good Life", "Closer", "Shape of You", "Faded", "Stay", "Yellow"]
};

alexaApp.launch(function(request, response) {
  response.say("App launched!");
});

alexaApp.intent("weather", {
    "slots": { "COUNTRIES": "LITERAL"},
    "utterances": ["{what is|how is} the weather in {countries|COUNTRIES}"]
  },
  function(request, response) {
    console.log('request content' + request);
    response.say("It's sunny");
  }
);

alexaApp.intent("playMusic", {
    "slots": { "SONGS": "LITERAL"},
    "utterances": ["play music {songs|SONGS} "]
  },
  function(request, response) {
      response.say("ok, playing"+request.slot("SONGS")+'now');
  }
);


app.listen(PORT);
console.log("Listening on port " + PORT + ", try http://localhost:" + PORT + "/test");
