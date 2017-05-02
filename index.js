var alexa = require("alexa-app");

var app = new alexa.app("test");

var template = require("./template.js");
// Microsoft Graph JavaScript SDK
// npm install msgraph-sdk-javascript
var MicrosoftGraph = require("msgraph-sdk-javascript");

app.dictionary = {
  "songs": ["Good Life", "Closer", "Shape of You", "Faded", "Stay", "Yellow"],
  "titles": ["Business", "Meeting", "Tour"],
  "contents":[]
};

var templateSubject='';

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

//mail serverice
app.intent("mailIntent", {
    "slots": {

    },
    "utterances": ["mail serverice"]
  },
  function(request, response) {
      console.log(JSON.stringify(request));
      response.say("ok, mail service .. which feature do you want .. send mail .. check mail").reprompt("please say again").shouldEndSession(false);
      // return false;
  }
);

//send mail & ask subject
app.intent("sendMailIntent", {
    "slots": {

    },
    "utterances": ["send mail"]
  },
  function(request, response) {
      console.log(JSON.stringify(request));
      response.say("ok, send mail .. what is your title").reprompt("please say again").shouldEndSession(false);
      // return false;
  }
);

// send mail get subject and ask content
app.intent("mailSubjectIntent", {
    "slots": {
      "SUBJECT": "MailSubject"
    },
    "utterances": ["mail title {titles|SUBJECT} ", "title is {titles|SUBJECT}", "title name {titles|SUBJECT}"]

  },
  function(request, response) {
      console.log(JSON.stringify(request));
      response.say("ok, your mail title is " + request.slot("SUBJECT") + "..");
      response.say("and what is your content ..").reprompt("please say again").shouldEndSession(false);
      templateSubject = request.slot("SUBJECT");
      // return false;
  }
);

//mail get content and send
app.intent("mailContentIntent", {
    "slots": {
      "CONTENT": "MailContent"
    },
    "utterances": ["mail message {contents|CONTENT}" , "content {contents|CONTENT}", "message text {contents|CONTENT}"]
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
        //
        var mail = {
            subject: templateSubject,
            toRecipients: [{
                emailAddress: {
                    address: "Kai_Yang@wistron.com"
                }
            }],
            body: {
                content: request.slot("CONTENT"),
                contentType: "html"
            }
        }
      client
          .api('/me/sendMail')
          .post(
              {message: mail},
              (err, res) => {
                  if (err){
                      console.log(err);
                    }else{
                      console.log('request content' + JSON.stringify(request) );
                      console.log('res content' + JSON.stringify(res) );
                      console.log('response content' + JSON.stringify(response) );
                    }
              })

    response.say("send an mail title: "+ templateSubject +' now').reprompt("please say again").shouldEndSession(false);

    }else{
        console.log('no token');
    }
    return false;
  }


);

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
                  client
                  .api(url)
                  .header("Prefer", 'outlook.timezone="Asia/Taipei"')
                  .top(20)
                  .get((err, res) => {
                      if (err) {
                          console.log(err)
                          return;
                      }else{
                          console.log(url);
                          console.log("check mail" + JSON.stringify(res));

                          var upcomingEventNames = {
                            displayName:'',
                            unreadItemCount:'',
                            totalItemCount:''
                          };
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
                          console.log("mail box JSON: " + JSON.stringify(upcomingEventNames.displayName));
                          console.log("mail box: " + typeof(upcomingEventNames));
                          console.log("mail Name: " + upcomingEventNames.displayName);
                          console.log("mail unread: " + typeof(upcomingEventNames.unreadItemCount));
                          console.log("mail total: " + typeof(upcomingEventNames.totalItemCount));
                          // var replyMessage = 'you have '+ upcomingEventNames.length +' meeting today. . ';
                          //
                          // for(var i=1; i<=upcomingEventNames.length; i++){
                          //     replyMessage += i+'. ' + res.value[i-1].subject + ' at ' + res.value[i-1].start.dateTime.substring(res.value[i-1].start.dateTime.lastIndexOf("T")+1,res.value[i-1].start.dateTime.lastIndexOf("."))+'. . ';
                          // }

                      }
                  })

      response.say("check mail: ").reprompt("please say again").shouldEndSession(false);

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
