var gdax = require('gdax');
var util = require('util');

var onderbookSync;

var updateStatus = function(data) {
  var state = orderbookSync.book.state();
  var highestBid = -1;
  var lowestAsk = -1;
  if(state.bids[0]) {
    highestBid = state.bids[0].price;
  }
  if(state.asks[0]) {
    lowestAsk = state.asks[0].price;
  }
  var str = util.format("[%d]\t%d\t%d\t%s", data.sequence, highestBid, lowestAsk, data.type);
  console.log(str);
}

var messageReceived = function(data)
{
  updateStatus(data);
}

orderbookSync = new gdax.OrderbookSync('ETH-USD', 'https://api.gdax.com', 'wss://ws-feed.gdax.com', messageReceived);
//var orderbookSync = new gdax.OrderbookSync(productID='ETH-USD', 'https://api-public.sandbox.gdax.com', 'wss://ws-feed.gdax.com');

console.log(orderbookSync.book.state());

//setInterval(updateStatus, 500); // refresh every 10 secs

