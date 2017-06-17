/* jshint node: true */
"use strict";

var gdax = require('gdax');
var publicClient = new gdax.PublicClient('ETH-USD', 'https://api.gdax.com');
//var sandboxClient = new gdax.PublicClient('ETH-USD', 'https://api-public.sandbox.gdax.com');

var generic_handler = function(err, response, data) {
  if (err !== null) {
    console.log('-------------------------');
    console.log('---------ERR-------------');
    console.log('-------------------------');
    console.log(err);
    console.log('-------------------------');
  }

  if (true && data !== null) {
    console.log('-------------------------');
    console.log('---------data------------');
    console.log('-------------------------');
    console.log(data);
    console.log('-------------------------');
  }
};

//console.log('=========================');
//publicClient.getProductOrderBook({'level': 2}, generic_handler);
//console.log('=========================');
//publicClient.getProductTicker(generic_handler);
//console.log('=========================');
//publicClient.getProductTrades(generic_handler);
//console.log('=========================');
var time_handler = function(err, response, data){

  var date = new Date(data.iso);
  date.setDate(date.getDate() - 50);

  console.log(data);

  publicClient.getProductHistoricRates({'start': date.toISOString(), 'end': data.iso, 'granularity': 3600}, generic_handler);
};

//publicClient.getCurrencies(generic_handler);
publicClient.getTime(time_handler);
//publicClient.getProduct24HrStats(generic_handler);
