'use strict';

// Weather Example
// See https://wit.ai/sungkim/weather/stories and https://wit.ai/docs/quickstart
const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
const Config = require('./const.js');
const request = require('request');
const Mock = require('./mock.js');

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

// Bot actions
const actions = {
  say(sessionId, context, message, cb) {
    console.log('Message From wit.ai: ' + message);

    // Bot testing mode, run cb() and return
    if (require.main === module) {
      cb();
      return;
    }

    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to from context
    // TODO: need to get Facebook user name
    var recipientId = context._fbid_;
    if(!recipientId){
      recipientId = context.recipient_id;
    }
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      FB.fbMessage(recipientId, message, (err, data) => {
        if (err) {
          console.log(
            'Oops! An error occurred while forwarding the response to',
            recipientId,
            ':',
            err
          );
        }

        // Let's give the wheel back to our bot
        cb();
      });
    } else {
      console.log('Oops! Couldn\'t find user in context:', context);
      // Giving the wheel back to our bot
      cb();
    }
  },
  merge(sessionId, context, entities, message, cb) {
    if(context.noCinemaInThisCity){
      context.noCinemaInThisCity = null;
    }

    // save fbid as recipient_id to context
    const fbid = context._fbid_;
    if(fbid){
      context.recipient_id = fbid;
    }

    //Use this for debugging the context, entities and message
    //console.log("Merge Funktion aus bot.js mit Context: " + JSON.stringify(context), " entities: " + JSON.stringify(entities) + " message: " + JSON.stringify(message));

    // Retrieve the location entity and store it into a context field
    const loc = firstEntityValue(entities, 'location');
    if (loc) {
      // If the location is Basel, Lausanne or Genf, store the location in selectedCity, so the showAvailableTheatres action is called
      if(loc === 'Basel' || loc === 'Lausanne' || loc === 'Genf'){
        context.selectedCity = loc;

      }
      // Here are the "known locations"
      else if (loc === 'Dietlikon' || loc === 'Bern' || loc === 'Pathé Küchlin' || loc === 'Pathé Plaza' || loc === 'Pathé Flon' || loc === 'Pathé Galeries' || loc === 'Pathé Balexert' || loc === 'Pathé Rex' || loc === 'Egal'){
        context.loc = loc; // store it in context
      } else {
        // Otherwise, set noCinemaInThisCity, so we can send the correct message to the chat.
        context.noCinemaInThisCity = loc;
      }
    }
    const selectedMovie = firstEntityValue(entities, 'selectedMovie');
    if (selectedMovie) {
      context.selectedMovie = selectedMovie; // store it in context
    }
    const selectedDate = firstEntityValue(entities, 'datetime');
    if(selectedDate){
      context.selectedDate = selectedDate;
    }

    cb(context);
  },

  error(sessionId, context, error) {
    console.log("Es ist folgender Error aufgetreten: " + error.message);
  },

  // findMovies bot executes
  ['findMovies'](sessionId, context, cb) {
    console.log("findMovie in " + context.loc);
    console.log("findMovie at " + context.requestedTime);
/*    getPatheInfos(function(patheInfoResult) {
      context.movie = patheInfoResult;
      console.log("findMovie which movie: " + context.movie);
      cb(context);
    });*/
  },

  // findMovies bot executes
  ['showAvailableMovies'](sessionId, context, cb) {
    Mock.getMoviesInBubbles(function(result) {
      var recipientId = context.recipient_id;
      if(!recipientId){
        recipientId = context.recipient_id;
        console.log("use context.recipient_id in showAvailableMovies: " + recipientId);
      }
      console.log("use context._fbid_ in showAvailableMovies: " + recipientId);
      FB.sendMessage(recipientId, JSON.stringify(result), cb);
      cb(context);
    });
  },

  // findMovies bot executes
  ['showAvailableDates'](sessionId, context, cb) {
    context.showAvailableDatesSent = "true";
    Mock.getAvailableDates(function(result) {
      var recipientId = context.recipient_id;
      console.log("Facebook Recipient ID in showAvailableDates: " + recipientId);
      FB.sendMessage(recipientId, JSON.stringify(result), cb);
      cb(context);
    });
  },

  // findMovies bot executes
  ['showAvailableTimes'](sessionId, context, cb) {
    context.availableTimesSent = "true";
    Mock.getAvailableTimes(function(result) {
      var recipientId = context.recipient_id;
      console.log("Facebook Recipient ID in showAvailableTimes: " + recipientId);
      FB.sendMessage(recipientId, JSON.stringify(result), cb);
      cb(context);
    });
  },

  // findMovies bot executes
  ['showAvailableTheatres'](sessionId, context, cb) {
    context.showAvailableTheatresSent = true;
    const selectedCity = context.selectedCity;
    if(selectedCity === 'Basel'){
      Mock.getTheatresInBasel(function(result) {
        var recipientId = context.recipient_id;
        console.log("showAvailableTheatres in Basel");
        FB.sendMessage(recipientId, JSON.stringify(result), cb);
        cb(context);
      });
    } else if(selectedCity === 'Lausanne'){
      Mock.getTheatresInLausanne(function(result) {
        var recipientId = context.recipient_id;
        console.log("showAvailableTheatres in Lausanne");
        FB.sendMessage(recipientId, JSON.stringify(result), cb);
        cb(context);
      });
    } else {
      Mock.getTheatresInGenf(function(result) {
        var recipientId = context.recipient_id;
        console.log("showAvailableTheatres in Genf");
        FB.sendMessage(recipientId, JSON.stringify(result), cb);
        cb(context);
      });
    }
  },

  // structureMessage bot executes
  ['structuredMessage'](sessionId, context, cb) {
    var structuredMessage = getStructuredMessage(cb)
    console.log("structuredMessage: " + structuredMessage);
    cb(structuredMessage);
  }
};


const getWit = () => {
  return new Wit(Config.WIT_TOKEN, actions, Config.witLogLevel);
};

exports.getWit = getWit;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
  console.log("Bot testing mode.");
  const client = getWit();
  client.interactive();
}

//create api call to https://pathe-ch.namics-test.com/solr/pathe-movies/quickbuy?fq=movie_id:1009774&fq=site:BAL&fq=cinemadate:18.04.2016
var getPatheInfos = function(cb) {
 cb("The Nice Guys");
/*  request('http://pathe-ch.namics-test.com/solr/pathe-movies/quickbuy?fq=movie_id:1009774&fq=site:BAL&fq=cinemadate:18.04.2016', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      cb(JSON.parse(body));
    } else {
      console.log('Request failed', error);
    }
  })*/
}






