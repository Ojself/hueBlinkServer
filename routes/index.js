require('dotenv').config();
require('es6-promise').polyfill();
/* const Log = require('../models/Log'); */
const express = require('express');
const router = express.Router();
const hue = require('node-hue-api');

/* TODO:
- Leave another color so the user knows an alert was being fired?
- Add security so the whole world can't blink the lights (login function)?
- Store IP, user, time of each apicall in database? (issues due to rasperry pie, make another call to heroku to store data?)
- Store rgb in oldvalue to set back to normal state?
 */

/* GET do primary function */
/* eg: 82.52.35.90:3000/startblink */
router.get('/startblink', (req, res, next) => {
  let oldValue = { state: null },
    HueApi = hue.HueApi,
    lightState = hue.lightState;

  var setStatus = status => {
    oldValue.state = status.state;
  };

  var displayResult = result => {
    console.log(result);
  };

  var displayError = err => {
    console.error(err);
  };

  /* process.env refers to .env in your root folder */
  var host = process.env.host,
    username = process.env.username,
    api = new HueApi(host, username),
    blinkState = lightState
      .create()
      .on()
      .rgb(255, 0, 0)
      .longAlert();

  /* Gets the initial information of the light */
  api.getLightStatusWithRGB(1).then(setStatus);

  /* calls the light to do set the values with blinkState */
  api
    .setLightState(1, blinkState)
    .then(displayResult)
    .fail(displayError)
    .done();

  /* Sets lights back to initial state after alert is done. */
  setTimeout(() => {
    if (oldValue.state.on) {
      api
        .setLightState(1, oldValue.state)
        .then(displayResult)
        .fail(displayError)
        .done();
    } else {
      api.setLightState(1, { on: false });
    }
  }, 8000);

  /* MongoDB  */
  /* let ip = req.ip;
  const newLog = new Log({
    ip
  });
  newLog.save().then(() => {
    res.json('SUCCESS');
  }); */
});

module.exports = router;
