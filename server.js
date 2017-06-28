// server.js


var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Candle = require('./model/candles');

// create instances of app and router
const app = express();
const router = express.Router();
// set our port to either a predetermined port number if you have set
// it up, or 3001
const port = process.env.API_PORT || 3001;

// connect to db
mongoose.connect('mongodb://poofessor:palladin@cluster0-shard-00-00-gz0ro.mongodb.net:27017,cluster0-shard-00-01-gz0ro.mongodb.net:27017,cluster0-shard-00-02-gz0ro.mongodb.net:27017/<DATABASE>?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

// now we should configure the API to use bodyParser and look for
// JSON data in the request body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// To prevent errors from Cross Origin Resource Sharing, we will set
// our headers to allow CORS with middleware like so:
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  // and remove cacheing so we get the most recent candles
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// now we can set the route path & initialize the API
router.get('/', (req, res) => {
  res.json({message: 'API Initialized!'});
});

// adding the /candles route to our /api router
router.route('/candles')
// retrieve all candles from the database
  .get(function(req, res) {
  // looks at our Candle Schema
  Candle.find(function(err, candles) {
    if (err)
      res.send(err);

    // responds with a json object of our database candles.
    res.json(candles)
  });
})

// post new comment to the database
  .post(function(req, res) {
  const candle = new Candle();
  //body parser lets us use the req.body
  candle.epoch = req.body.epoch;
  candle.low = req.body.low;
  candle.high = req.body.high;
  candle.open = req.body.open;
  candle.close = req.body.close;
  candle.volume = req.body.volume;
  candle.save(function(err) {
    if (err)
      res.send(err);
    res.json({message: 'Candle successfully added.'});
  });
});
// Use our router configuration when we call /api
app.use('/api', router);
// starts the server and listens for requests
app.listen(port, () => {
  console.log(`api running on port ${port}`);
});
