'use strict';

// Returns a random integer between min (inclusive) and max (inclusive)
const getRandomInt = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min;

module.exports.accessAcount = (event, context, callback) => {
  
  let msg = '';
  // msg += 'catchIdent:' + JSON.stringify(event.request.intent); 
  
  if(event.request.intent.name == 'GetAirQuality'){
    // pretend got air quality data  
    msg += 'air quality is bad'
  }else if(event.request.intent.name == 'SingSong'){
    msg += 'I have an apple, I have a pen~'
  }else if(event.request.intent.name == 'BallGame'){
    msg += 'it is a sport game'
  }else if(event.request.intent.name == 'GetLuckyNumbers'){
    const getRandomInt = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min;
    const upperLimit = event.request.intent.slots.UpperLimit.value || 100;
    const number = getRandomInt(0, upperLimit);

    // 使用${number}應該是類似樣板用法, 之後再研究, 現在先寫死
    msg += 'your lucky number is 3';
  }else if(event.request.intent.name == 'GetWeatherByTime'){

    msg += "rain..."
  }else{
    msg +='no match intent'
  }

  const response = {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'PlainText',
        text: msg,
      },
      shouldEndSession: false,
    },
  };

  callback(null, response);
};
