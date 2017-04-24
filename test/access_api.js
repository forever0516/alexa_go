const simpleOauthModule = require('simple-oauth2');

// oauth2 process
const oauth2 = simpleOauthModule.create({
  client: {
    id: '41053724-f972-4fcb-a4c3-859db1e40356',
    secret: 'w5wyc9RNWdr9MFWuZN244YE',
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    tokenPath: '/common/oauth2/v2.0/token',
    authorizePath: '/common/oauth2/v2.0/authorize',
  },
});

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: 'https://pitangui.amazon.com/api/skill/link/M3182I83WONRQA',
  scope: 'offline_access+user.read+mail.read+mail.send+calendars.read+calendars.readwrite.shared+calendars.read.shared',
  state: '3(#0/!~',
});

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
  console.log(authorizationUri);
  res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', (req, res) => {
  const code = req.query.code;
  const options = {
    code,
  };

  oauth2.authorizationCode.getToken(options, (error, result) => {
    if (error) {
      console.error('Access Token Error', error.message);
      return res.json('Authentication failed');
    }

    console.log('The resulting token: ', result);
    const token = oauth2.accessToken.create(result);

    return res
      .status(200)
      .json(token);
  });
});


// Get the name of the authenticated user with callbacks
// const client = MicrosoftGraph.init({
//     defaultVersion: 'v1.0',
//     debugLogging: true,
//     authProvider: (done) => {
//         done(null, secrets.accessToken);
//     }
// });


// client
//     .api('/me')
//     .select("displayName")
//     .get((err, res) => {
//         if (err) {
//             console.log(err)
//             return;
//         }
//         console.log(res.displayName);
//     });