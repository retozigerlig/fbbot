'use strict';

// Messenger API integration example
// We assume you have:
// * a Wit.ai bot setup (https://wit.ai/docs/quickstart)
// * a Messenger Platform setup (https://developers.facebook.com/docs/messenger-platform/quickstart)
// You need to `npm install` the following dependencies: body-parser, express, request.
//
const bodyParser = require('body-parser');
const express = require('express');

// get Bot, const, and Facebook API
const bot = require('./bot.js');
const Config = require('./const.js');
const FB = require('./facebook.js');

// Setting up our bot
const wit = bot.getWit();

// Webserver parameter
const PORT = process.env.PORT || 8445;

// Wit.ai bot specific code

// This will contain all user sessions.
// Each session has an entry:
// sessionId -> {fbid: facebookUserId, context: sessionState}
const sessions = {};

const findOrCreateSession = (fbid) => {
  console.log("FBID die verwendet wird: " + fbid);
  let sessionId;
  // Let's see if we already have a session for the user fbid
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // Yep, got it!
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbid, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {
      fbid: fbid,
      context: {
        _fbid_: fbid
      }
    }; // set context, _fid_
  }
  return sessionId;
};

// Starting our webserver and putting it all together
const app = express();
app.set('port', PORT);
app.listen(app.get('port'));
app.use(bodyParser.json());
console.log("I'm wating for you @" + PORT);

// index. Let's say something fun
app.get('/', function(req, res) {
  res.send('Testbot up and running. Keep talking :D');
});

// Webhook verify setup using FB_VERIFY_TOKEN
app.get('/webhook', (req, res) => {
  if (!Config.FB_VERIFY_TOKEN) {
    throw new Error('missing FB_VERIFY_TOKEN');
  }
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

// The main message handler
app.post('/webhook', (req, res) => {
  // Parsing the Messenger API response
  const messaging = FB.getFirstMessagingEntry(req.body);
  if(messaging.postback){
    console.log("webhook called with postback.payload message in req.body: " + messaging.postback.payload + " from sender with id: " + messaging.sender.id);
  }

  if (messaging && (messaging.message || messaging.postback)) {

    // Yay! We got a new message!

    // We retrieve the Facebook user ID of the sender
    const sender = messaging.sender.id;

    // We retrieve the user's current session, or create one if it doesn't exist
    // This is needed for our bot to figure out the conversation history
    const sessionId = findOrCreateSession(sender);
    console.log("sessionID at " + messaging.timestamp + " : " + sessionId);

    // We retrieve a message. Is it a common message or a postback?
    var msg;
    var atts;
    if(messaging.message){
      msg = messaging.message.text;
      atts = messaging.message.attachments;
    } else if(messaging.postback){
      msg = messaging.postback.payload;
    }

    if (atts) {
      // We received an attachment

      // Let's reply with an automatic message
      FB.fbMessage(
        sender,
        'Sorry I can only process text messages for now.'
      );
    } else if (msg) {
      // We received a text message

      // Let's forward the message to the Wit.ai Bot Engine
      // This will run all actions until our bot has nothing left to do

      //save selectedMovie to context
      if(msg.indexOf("selectedMovie") > -1){
        console.log("SelectedMovie in den Context gespeichert: " + JSON.stringify(msg));
        sessions[sessionId].context.selectedMovie = msg;
      }

      //save selectedDate to context
      if(msg.indexOf('Heute') > -1){
        console.log("Datum in den Context gespeichert: Heute");
        sessions[sessionId].context.selectedDate = msg;
      }
      if(msg.indexOf('Morgen') > -1){
        console.log("Datum in den Context gespeichert: Morgen");
        sessions[sessionId].context.selectedDate = msg;
      }
      if(msg.indexOf('otherDate') > -1){
        console.log("Datum in den Context gespeichert: otherDate");
        sessions[sessionId].context.otherDate = msg;
      }

          wit.runActions(
              sessionId, // the user's current session
              msg, // the user's message 
              sessions[sessionId].context, // the user's current session state
              (error, context) => {
                console.log('Context: ' + JSON.stringify(context));
                if (error) {
                  console.log('Oops! Got an error from Wit:', error);
                } else {
                  // Our bot did everything it has to do.
                  // Now it's waiting for further messages to proceed.
                  console.log('Waiting for futher messages.');

                  // Based on the session state, you might want to reset the session.
                  // This depends heavily on the business logic of your bot.
                  // Example:
                  // if (context['done']) {
                  //   delete sessions[sessionId];
                  // }

                  // If the availableTimes are displayed, delete the session
                  if(sessions[sessionId].context.availableTimesSent){
                    delete sessions[sessionId];
                  }

                  // Updating the user's current session state
                  sessions[sessionId].context = context;
                }
              },
              3
          );
    }
  }
  res.sendStatus(200);
});