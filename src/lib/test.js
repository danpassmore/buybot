//data.js
var gdax = require('gdax');
var publicClient = new gdax.PublicClient('ETH-USD', 'https://api.gdax.com');

const data = [
 ['test'], ['two']
];

//var sandboxClient = new gdax.PublicClient('ETH-USD', 'https://api-public.sandbox.gdax.com');

/* how far back in time (in seconds) to get data with multiple queries */
var lookback_time_secs = 10 * 24 * 3600; // 10 days
/* How many seconds of candle data we will ask gdax about with each query */
var query_interval_secs = 24*3600; // one day
/* (within a query) How long each candle should be in seconds */
var candle_secs = 2*3600; // 2h candles

/* the start date for our overall dump of candles (across multiple queries). Will be filled in after first query to gdax for server time */
var start_date;
/* dynamic date cursor used to mark the end time for each query */
var date_cursor;


var printing_handler = function(err, response, printdata) {

  if (err !== null) {
    // console.log('-------------------------');
    // console.log('---------ERR-------------');
    // console.log('-------------------------');
    // console.log(err);
    // console.log('-------------------------');
  }

  if (printdata !== null) {
    // console.log('-------------------------');
    // console.log('---------data------------');
    // console.log('-------------------------');
    // console.log(printdata);
    // console.log('-------------------------');
    debugger;
    for (let item in printdata) {
      data.push(item);
    }
  }
};


var handle_and_start_next_query;

var query_next_time_block = function() {
  if(date_cursor > start_date) {
    /* initialize the end-date for the new query as the current cursor date */
    var date2 = new Date(date_cursor.getTime());

    /* move cursor back in time by one period */
    date_cursor.setSeconds(date_cursor.getSeconds() - query_interval_secs);

    console.log('from ' + date_cursor + ' to ' + date2 + ':');
    publicClient.getProductHistoricRates({'start': date_cursor.toISOString(), 'end': date2.toISOString(), 'granularity': candle_secs}, handle_and_start_next_query);
  }
};

var handle_and_start_next_query = function(err, response, data) {
  /* print data */
  printing_handler(err, response, data);
  if (err === null && data !== null) {
    /* delay each call by 300ms to not exceed 3 API-calls/sec rate limits on api */
    setTimeout(query_next_time_block, 334);
  }
};

var setup_query_boundaries_and_go = function(err, response, data){
  console.log('err', err);
  console.log('data', data);
  if (err === null && data !== null) {
    date_cursor = new Date(data.iso);
    start_date = new Date(data.iso);
    start_date.setSeconds(start_date.getSeconds() - lookback_time_secs);
    query_next_time_block();
  }
  // else
  // {
  //   printing_handler(err, response, data);
  // }
};

/* these commented functions are not needed, but you can uncomment to see what they do */
//publicClient.getProduct24HrStats(printing_handler);
//publicClient.getCurrencies(printing_handler);
//publicClient.getProductOrderBook({'level': 2}, printing_handler);
//publicClient.getProductTicker(printing_handler);
//publicClient.getProductTrades(printing_handler);

/* start process of getting candles! */
publicClient.getTime(setup_query_boundaries_and_go);
module.exports = data;
