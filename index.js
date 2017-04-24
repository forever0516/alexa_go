var alexa = require("alexa-app");

var app = new alexa.app("test");

// Microsoft Graph JavaScript SDK
// npm install msgraph-sdk-javascript
var MicrosoftGraph = require("msgraph-sdk-javascript");
var async = require("async");

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

  // access API
  function(request, response) {
    
    async.waterfall([
    function(callback) {
        var session = request.getSession();
        callback(null, session);
    },
    function(session, callback) {
        console.log('session: '+JSON.stringify(session));
        var accessToken = session.details.accessToken;
        callback(null, accessToken);
    },
    function(accessToken, callback) {
        console.log('accessToken: ' + accessToken);
        var client = MicrosoftGraph.Client.init({
              authProvider: (done) => {
                  done(null, accessToken);
              }
        });
        // arg1 now equals 'three'
        callback(null, client);
    },
    function(client, callback) {
        console.log('client: ' + client);
        client
        .api('/me')
        .select("displayName")
        .get()
        .then((res) => {
            console.log(JSON.stringify(client));
            console.log(JSON.stringify(res));
        })
        .catch(console.error);

        callback(null, 'done');
    }
    ], function (err, result) {
        // result now equals 'done'
    });






    //
    // var session = request.getSession();
    // console.log('session: '+JSON.stringify(session));
    // var accessToken = session.get('accessToken');


    // if(accessToken){
    //     console.log('accessToken: ' + accessToken);
    //     var client = MicrosoftGraph.Client.init({
    //           authProvider: (done) => {
    //               done(null, accessToken);
    //           }
    //     });

    //     client
    //     .api('/me')
    //     .select("displayName")
    //     .get()
    //     .then((res) => {
    //         console.log(JSON.stringify(client));
    //         console.log(JSON.stringify(res));
    //     })
    //     .catch(console.error);
    // }else{
    //     console.log('no token');
    // }
  
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
      console.log(JSON.stringify(request));
      response.say("ok, playing "+request.slot("SONGS")+' now');
  }
);

app.intent("errorIntent", function(request, response) {
  response.say(someVariableThatDoesntExist);
});

// connect to lambda
exports.handler = app.lambda();

