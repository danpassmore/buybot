import React, {Component} from 'react';
import gdax from 'gdax';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.publicClient = new gdax.PublicClient('ETH-USD', 'https://api.gdax.com');

    /* how far back in time (in seconds) to get data with multiple queries */
    this.lookback_time_secs = 10 * 24 * 3600; // 10 days
    /* How many seconds of candle data we will ask gdax about with each query */
    this.query_interval_secs = 24*3600; // one day
    /* (within a query) How long each candle should be in seconds */
    this.candle_secs = 2*3600; // 2h candles

    /* the start date for our overall dump of candles (across multiple queries). Will be filled in after first query to gdax for server time */
    this.start_date;
    /* dynamic date cursor used to mark the end time for each query */
    this.date_cursor;

  };

  setup_query_boundaries_and_go = (err, response, data) => {
    if (err === null && data !== null) {
      this.date_cursor = new Date(data.iso);
      this.start_date = new Date(data.iso);
      this.start_date.setSeconds(this.start_date.getSeconds() - this.lookback_time_secs);
      this.query_next_time_block();
    }
  };

  query_next_time_block = () => {
    if(this.date_cursor > this.start_date) {
      /* initialize the end-date for the new query as the current cursor date */
      let date2 = new Date(this.date_cursor.getTime());

      /* move cursor back in time by one period */
      this.date_cursor.setSeconds(this.date_cursor.getSeconds() - this.query_interval_secs);

      // console.log('from ' + date_cursor + ' to ' + date2 + ':');
      this.publicClient.getProductHistoricRates({'start': this.date_cursor.toISOString(), 'end': date2.toISOString(), 'granularity': this.candle_secs}, this.handle_and_start_next_query);
    }
  };

  handle_and_start_next_query = (err, response, data) => {
    /* print data */
    // printing_handler(err, response, data);
    this.setState({data: data});
    // if (err === null && data !== null) {
    //   /* delay each call by 300ms to not exceed 3 API-calls/sec rate limits on api */
    //   setTimeout(query_next_time_block, 334);
    // }
  };

  componentDidMount() {
    this.publicClient.getTime(this.setup_query_boundaries_and_go);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Ethereum Data for the last 10 Days</h2>
        </div>
          {this.state.data.map((item, idx) => <div key={idx}>{item}</div>)}
      </div>
    );
  }
}

export default App;
