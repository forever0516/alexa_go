var express = require("express");
var alexa = require("alexa-app");

var PORT = process.env.port || 8080;
var app = express();
var Moment = require('moment-timezone');
// ALWAYS setup the alexa app and attach it to express before anything else.
var alexaApp = new alexa.app("test");

alexaApp.express({
  expressApp: app,

  // verifies requests come from amazon alexa. Must be enabled for production.
  // You can disable this if you're running a dev environment and want to POST
  // things to test behavior. enabled by default.
  checkCert: true,

  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production. disabled by default
  debug: true
});

// now POST calls to /test in express will be handled by the app.request() function

// from here on you can setup any other express routes or middlewares as normal
app.set("view engine", "ejs");

alexaApp.dictionary = {
  "songs": ["Good Life", "Closer", "Shape of You", "Faded", "Stay", "Yellow"]
};

alexaApp.launch(function(request, response) {
  response.say("App launched!");
});

alexaApp.intent("weather", {
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

alexaApp.intent("calendar", {
    "utterances": ["check calendar", "check my calendar"]
  },
  function(request, response) {
    
    var session = request.getSession();
    console.log('session: '+JSON.stringify(session));
    var accessToken = session.details.accessToken;

    if(accessToken){
        console.log('accessToken: ' + accessToken);
        var client = MicrosoftGraph.Client.init({
              authProvider: (done) => {
                  done(null, accessToken);
              }
        });

        //
        var Moment = require('moment-timezone');
        var today = Moment().tz('Asian/Taipei').startOf('hour').add(8, 'hours').format('YYYY-MM-DD');
        var startDate = today+'T'+'00:00:00.0000000';
        var endDate = today+'T'+'23:59:59.0000000';

        console.log('type '+ typeof(startDate));
        var url = '/me/calendar/calendarView?startDateTime='+ startDate.toString() + '&'+'endDateTime='+endDate.toString();
        //

        client
        .api(url.toString())
        .header("Prefer", 'outlook.timezone="Asia/Taipei"')
        .top(3)
        .get((err, res) => {
            if (err) {
                console.log(err)
                return;
            }else{
                console.log(url);
                var upcomingEventNames = []

                
                for (var i=0; i<res.value.length; i++) {
                    upcomingEventNames.push(JSON.stringify( res.value[i]));
                }
                
                var replyMessage = 'you have '+upcomingEventNames.length+' meeting today. . ';
                
                for(var i=1; i<=upcomingEventNames.length; i++){
                    replyMessage += i+'. ' + res.value[i-1].subject + ' at ' + res.value[i-1].start.dateTime.substring(res.value[i-1].start.dateTime.lastIndexOf("T")+1,res.value[i-1].start.dateTime.lastIndexOf("."))+'. . ';
                }
                if(upcomingEventNames.length>=3){
                    replyMessage += 'for more, please check your alexa app';
                }
                
                console.log(JSON.stringify(res));
                
                response.say(replyMessage);
            }
        })
    }else{
        console.log('no token');
    }
  }
);

alexaApp.intent("playMusic", {
    "slots": { 
      "SONGS": "LITERAL"
    },
    "utterances": ["play music {songs|SONGS} "]
  },
  function(request, response) {
      console.log(JSON.stringify(request));
      response.say("ok, playing "+request.slot("SONGS")+' now');
  }
);

alexaApp.intent("errorIntent", function(request, response) {
  response.say(someVariableThatDoesntExist);
});



app.listen(PORT);
console.log("Listening on port " + PORT + ", try http://localhost:" + PORT + "/test");
