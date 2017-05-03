var alexa = require("alexa-app");

var app = new alexa.app("test");

var template = require("./template.js");
// Microsoft Graph JavaScript SDK
// npm install msgraph-sdk-javascript
var MicrosoftGraph = require("msgraph-sdk-javascript");

app.dictionary = {
  "songs": ["Good Life", "Closer", "Shape of You", "Faded", "Stay", "Yellow"],
  "titles": ["Business", "Meeting", "Tour", "lunch"],
  "contents":["with Bill Ric", "go to lunch"]
};

var templateSubject='',
    templateContent ='';

app.launch(function(request, response) {
  response.say("welcome to gina .. what can I do for you").reprompt("welcome to gina mail").shouldEndSession(false);
  templateSubject = '';
});

// app.request(template.weather)
//   .then(function(response) {
//     response.say("it is hot");
//   });

// app.intent("calendar", {
//     "utterances": ["check calendar", "check my calendar"]
//   },
//   function(request, response) {
//
//     var session = request.getSession();
//     console.log('session: '+JSON.stringify(session));
//     var accessToken = session.details.accessToken;
//
//     if(accessToken){
//         // console.log('accessToken: ' + accessToken);
//         var client = MicrosoftGraph.Client.init({
//               authProvider: (done) => {
//                   done(null, accessToken);
//               }
//         });
//
//         //
//         var Moment = require('moment-timezone');
//         var today = Moment().tz('Asian/Taipei').startOf('hour').add(8, 'hours').format('YYYY-MM-DD');
//         var startDate = today+'T'+'00:00:00.0000000';
//         var endDate = today+'T'+'23:59:59.0000000';
//
//         console.log('type '+ typeof(startDate));
//         var url = '/me/calendar/calendarView?startDateTime='+ startDate.toString() + '&'+'endDateTime='+endDate.toString();
//         //
//
//         client
//         .api(url.toString())
//         .header("Prefer", 'outlook.timezone="Asia/Taipei"')
//         .top(3)
//         .get((err, res) => {
//             if (err) {
//                 console.log(err)
//                 return;
//             }else{
//                 console.log(url);
//                 var upcomingEventNames = []
//
//
//                 for (var i=0; i<res.value.length; i++) {
//                     upcomingEventNames.push(JSON.stringify( res.value[i]));
//                 }
//
//                 var replyMessage = 'you have '+upcomingEventNames.length+' meeting today. . ';
//
//                 for(var i=1; i<=upcomingEventNames.length; i++){
//                     replyMessage += i+'. ' + res.value[i-1].subject + ' at ' + res.value[i-1].start.dateTime.substring(res.value[i-1].start.dateTime.lastIndexOf("T")+1,res.value[i-1].start.dateTime.lastIndexOf("."))+'. . ';
//                 }
//                 if(upcomingEventNames.length>=3){
//                     replyMessage += 'for more, please check your alexa app';
//                 }
//
//                 console.log('replyMessage:' + JSON.stringify(replyMessage));
//                 response.say(replyMessage);
//
//             }
//         })
//
//     }else{
//         console.log('no token');
//     }
//   }
// );

// app.intent("playMusic", {
//     "slots": {
//
//     },
//     "utterances": ["play music"]
//   },
//   function(request, response) {
//       // var reprompt = 'playing music.';
//
//       console.log(JSON.stringify(request));
//       response.say("ok, which songs do you want to play").shouldEndSession(false);
//       // return false;
//   }
// );

// app.intent("MusicName", {
//     "slots": {
//       "SONGS": "AMAZON.MusicPlaylist"
//     },
//     "utterances": ["music {songs|SONGS} "]
//   },
//   function(request, response) {
//       console.log(JSON.stringify(request));
//       response.say("ok, playing "+ request.slot("SONGS")+' now');
//       return false;
//   }
// );


//mail get content and send
app.intent("mailIntent", {
    "slots": {
      "CONTENT": "MailContent",
      "SUBJECT": "MailSubject"
    },
    "utterances": ["send mail title {titles|SUBJECT} message {contents|CONTENT}"]
  },
  function(request, response) {

    var session = request.getSession();
    console.log('session: '+JSON.stringify(session));
    var accessToken = session.details.accessToken;
    if(accessToken){
        // console.log('accessToken: ' + accessToken);
        var client = MicrosoftGraph.Client.init({
              authProvider: (done) => {
                  done(null, accessToken);
              }
        });
        //
        var url = '/me/sendMail';
        var replyMessage = 'Send an email';
        templateContent = request.slot("CONTENT");
        templateSubject = request.slot("SUBJECT");
        //
        var mail = {
            subject: templateSubject,
            toRecipients: [{
                emailAddress: {
                    address: "Kai_Yang@wistron.com"
                }
            }],
            body: {
                content: templateContent,
                contentType: "html"
            }
        }
      return client
          .api('/me/sendMail')
          .post({message:mail})
          .then((res) => {
            console.log('request content' + JSON.stringify(request) );
            console.log('res content' + JSON.stringify(res) );
            console.log('response content' + JSON.stringify(response) );
            response.say("send an mail title: "+ templateSubject +' now content: ' + templateContent).reprompt("please say again").shouldEndSession(false);
            templateSubject = '';
            templateContent = ''
;          }).catch((err) => {
            console.log(err);
          });

    }else{
        console.log('no token');
    }
    return false;
  });

// check mail
app.intent("checkMailIntent", {
    "slots": {

    },
    "utterances": ["check mail"]

  },
  function(request, response) {

      var session = request.getSession();
      console.log('session: '+JSON.stringify(session));
      var accessToken = session.details.accessToken;
      if(accessToken){
          // console.log('accessToken: ' + accessToken);
          var client = MicrosoftGraph.Client.init({
                authProvider: (done) => {
                    done(null, accessToken);
                }
          });
          //
          var url = '/me/mailFolders/';
          //
          return   client
                  .api(url)
                  .header("Prefer", 'outlook.timezone="Asia/Taipei"')
                  .top(20)
                  .get()
                  .then((res) => {

                    console.log(url);
                    console.log("check mail" + JSON.stringify(res));

                    var upcomingEventNames = {
                      displayName:'',
                      unreadItemCount:'',
                      totalItemCount:''
                    };
                    var replyMessage = 'test';
                    var str = "收件匣";
                    for (var i=0; i<res.value.length; i++) {
                        if(res.value[i].displayName == str){
                          upcomingEventNames.displayName = res.value[i].displayName;
                          upcomingEventNames.unreadItemCount = res.value[i].unreadItemCount;
                          upcomingEventNames.totalItemCount = res.value[i].totalItemCount;
                          console.log(res.value[i].displayName);
                        }
                      }

                    console.log("mail box: " + JSON.stringify(upcomingEventNames));
                    console.log("mail Name: " + upcomingEventNames.displayName);
                    console.log("mail unread: " + upcomingEventNames.unreadItemCount);
                    console.log("mail total: " + upcomingEventNames.totalItemCount);

                    replyMessage = "Receiver folder have unread mail " + upcomingEventNames.unreadItemCount + " and total mail " + upcomingEventNames.totalItemCount;
                    response.say(replyMessage).shouldEndSession(false);

                  }).catch((err) =>{
                    console.log(err);
                  });

      }else{
          console.log('no token');
      }
      return false;
    }
);

app.intent("errorIntent", function(request, response) {
  response.say("error please say new intent").shouldEndSession(false);
});

// connect to lambda
exports.handler = app.lambda();
