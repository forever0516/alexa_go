var alexa = require("alexa-app");

var app = new alexa.app("test");

// Microsoft Graph JavaScript SDK
// npm install msgraph-sdk-javascript
var MicrosoftGraph = require("msgraph-sdk-javascript");

app.dictionary = {
  "songs": ["Good Life", "Closer", "Shape of You", "Faded", "Stay", "Yellow"]
};

app.launch(function(request, response) {
  response.say("welcome to gina go").reprompt("welcome to gina go").shouldEndSession(false);
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

app.intent("calendar", {
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
                
                console.log('replyMessage:' + JSON.stringify(replyMessage));
                
                response.say(replyMessage);
            }
        })
    }else{
        console.log('no token');
    }
  }
);

app.intent("playMusic", {
    "slots": { 
      "SONGS": "LITERAL"
    },
    "utterances": ["play music {songs|SONGS} "]
  },
  function(request, response) {
      var reprompt = 'playing music.';

      response.say(reprompt).send();
    
      console.log(JSON.stringify(request));
      response.say("ok, playing "+request.slot("SONGS")+' now');
      return false;      
  }
);


app.intent("errorIntent", function(request, response) {
  response.say(someVariableThatDoesntExist);
});

// connect to lambda
exports.handler = app.lambda();

