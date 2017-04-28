var template = {};
// LaunchRequest template
template.launch = {
  "version": "1.0",
  "session": {
    "new": true,
    "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
    "attributes": {},
    "application": {
      "applicationId": "amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe"
    },
    "user": {
      "userId": "amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2"
    }
  },
  "request": {
    "type": "LaunchRequest",
    "requestId": "amzn1.echo-api.request.9cdaa4db-f20e-4c58-8d01-c75322d6c423"
  }
};
// IntentRequest template
template.weather = {
  "version": "1.0",
  "session": {
    "new": false,
    "sessionId": "SessionId.334f779e-634a-4f3e-b855-0e3d9435392b",
    "attributes": {},
    "application": {
      "applicationId": "amzn1.ask.skill.babb7111-03b3-4662-9586-dd8de8811f31"
    },
    "user": {
      "userId": "amzn1.ask.account.AGJWL6M3IOY7YOYE2JJWDBLV3B2FBGKY2AVAEQVGRHB3UGOYOUI53MIG6MMMDWCTEOYRXZNOC43PUJLLMUS75DD5JPAA6XPNIMC3MBLKYDI3EKS4YECNV6YYIT2WKP3MXO2KLVGWQVAEW4IVG6PMCKY6PD36YMPVZQCNGHFG4PHAVEDTI2APLD67NGRK34A2V726CPSQVB2SGRA"
    }
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "EdwRequestId.58d1a0b2-a36d-45fb-8888-713b20f70988",
    "intent": {
      "name": "weather",
      "slots": {
        "NAME": {
          "name": "countries",
          "value": "japan"
        }
      }
    }
  }
};

module.exports = template;
