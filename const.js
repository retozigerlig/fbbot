'use strict';

// Wit.ai parameters
//pahteToken
 const WIT_TOKEN = '53VANOSQNMBKC4AI7OWWZFLLKF4NT4O4';
//testToken
//const WIT_TOKEN = 'BYZXJB4FLMARSQXIM5KX2BTKE4XN4MEX';
if (!WIT_TOKEN) {
  throw new Error('missing WIT_TOKEN');
}

// Messenger API parameters
const FB_PAGE_TOKEN = 'EAAG8IQqc3JcBAL22MjZAoNrNy37vvALPheelMftTS8NA8m4kTFPRzzGLIMk38mCCcAd1TKAoS1Snza2LtMAdFHYUczhWwzgZB6j3fQHVVZBoogpjDIADEqnGoUI1hTAknzKbQGLRXVyVFj7EuNR9GcyTTRMzhylURp9mS2wFwZDZD';

var FB_VERIFY_TOKEN = 'wit_facebook_verify_token';
if (!FB_VERIFY_TOKEN) {
  FB_VERIFY_TOKEN = "just_do_it";
}

const levels = require('node-wit').logLevels;
const witLogLevel = levels.DEBUG;

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
  witLogLevel: witLogLevel,
};