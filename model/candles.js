//model/candle.js


'use strict';

// import dependency
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create new instance of the mongoose.schema. the schema takes an
//object that shows the shape of your database entries.
const CandlesSchema = new Schema({
  epoch: Number,
  low: Number,
  high: Number,
  open: Number,
  close: Number,
  volume: Number
});

//export our module to use in server.js
module.exports = mongoose.model('Candle', CandlesSchema);
