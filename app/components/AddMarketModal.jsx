var React = require('react');
var Fluxxor = require("fluxxor");
var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var ReactBootstrap = require('react-bootstrap');
var ReactDOM = require('react-dom');
var ReactTabs = require('react-tabs');
var DatePicker = require('react-date-picker');
var moment = require('moment');
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Modal = ReactBootstrap.Modal;
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var AddMarketModal = React.createClass({

  mixins: [FluxMixin, StoreWatchMixin('market', 'network', 'asset')],

  getInitialState: function () {
    return {
      pageNumber: 1,
      marketText: '',
      marketTextMaxLength: 256,
      marketTextCount: '',
      marketTextError: null,
      marketInvestment: '501',
      marketInvestmentError: null,
      maturationDate: '',
      tradingFee: '2',
      tradingFeeError: null,
      valid: false,
      minDate: moment().format('YYYY-MM-DD'),
      numAnswers: 2,
      tab: 0,
      minimum: 0,
      maximum: 100
    };
  },

  getStateFromFlux: function () {
    var flux = this.getFlux();

    return {
      cash: flux.store('asset').getState().cash,
      currentBlock: flux.store('network').getState().blockNumber,
      currentBranch: flux.store('branch').getCurrentBranch()
    }
  },

  handleSelect: function (index, last) {
    this.setState({tab: index});
  },

  onChangeMarketText: function (event) {

    var marketText = event.target.value;

    if (marketText.length) {
      this.state.marketTextCount = marketText.length.toString()+'/'+this.state.marketTextMaxLength.toString();
    } else {
      this.state.marketTextCount = '';
    }

    this.setState({marketTextError: null});
    this.setState({marketText: marketText});
  },

  onChangeTradingFee: function (event) {

    var amount = event.target.value;
    if (!amount.match(/^[0-9]*\.?[0-9]*$/) ) {
      this.setState({tradingFeeError: 'invalid fee'});
    } else if (parseFloat(amount) > 12.5) {
      this.setState({tradingFeeError: 'must be less than 12.5%'});
    } else if (parseFloat(amount) < 0.7) {
      this.setState({tradingFeeError: 'must be greater than 0.7%'});
    } else {
      this.setState({tradingFeeError: null});
    }
    this.setState({tradingFee: amount});
  },

  onChangeMarketInvestment: function (event) {

    var marketInvestment = event.target.value;
    var cashLeft = this.state.cash - marketInvestment;

    if (cashLeft < 0) {
      this.setState({marketInvestmentError: 'cost exceeds cash balance'});
    } else {
      this.setState({marketInvestmentError: null});
    }
    this.setState({
      marketInvestment: marketInvestment
    });
  },

  onChangeMaturationDate: function (event) {
    this.setState({maturationDate: event.target.value});
  },

  onNext: function(event) {

    if (this.validatePage(this.state.pageNumber)) {
      var newPageNumber = this.state.pageNumber + 1;
      this.setState({pageNumber: newPageNumber});
    }
  },

  validatePage: function(pageNumber) {

    if (pageNumber === 1) {

      if (this.state.marketText.length > this.state.marketTextMaxLength) {
        this.setState({marketTextError: 'Text exceeds the maximum length of ' + this.state.marketTextMaxLength});
        return false;
      } else if (!this.state.marketText.length) {
         this.setState({marketTextError: 'Please enter your question'});
        return false;       
      }

    } else if (pageNumber === 2) {

      if (this.state.tradingFee === '') {
        this.setState({ tradingFeeError: 'invalid fee' });
        return false;
      } else if (this.state.marketInvestment === '') {
        this.setState({ marketInvestmentError: 'invalid amount' });
        return false;
      }

      if (this.state.marketInvestmentError || this.state.tradingFeeError) return false;

    } else if (pageNumber === 3) {

      if (this.state.maturationDate === '') return false;
    }
    return true;
  },

  onHide: function() {

    this.setState(this.getInitialState());
    this.props.onHide();
  },

  onBack: function(event) {
    var newPageNumber = this.state.pageNumber - 1;
    this.setState({pageNumber: newPageNumber});
  },

  addAnswer: function (event) {
    var numAnswers = this.state.numAnswers + 1;
    this.setState({numAnswers: numAnswers});
  },

  onSubmit: function(event) {
    if (!this.validatePage(this.state.pageNumber)) return;
    var self = this;
    var flux = this.getFlux();
    var newMarketParams = {
      description: this.state.marketText,
      initialLiquidity: this.state.marketInvestment,
      tradingFee: new BigNumber(this.state.tradingFee / 100)
    };
    var pendingId = flux.actions.market.addPendingMarket(newMarketParams);
    var branchId = flux.store("branch").getCurrentBranch().id;
    augur.createEvent({
      branchId: branchId,
      description: this.state.marketText,
      expDate: utilities.dateToBlock(moment(this.state.maturationDate)),
      minValue: 0,
      maxValue: 1,
      numOutcomes: 2,
      onSent: function (res) {
        if (res && res.txHash) {
          console.log("new event submitted:", res.txHash);
        }
      },
      onSuccess: function (res) {
        if (res && res.callReturn && res.txHash) {
          console.log("new event ID:", res.callReturn);
          var events = res.callReturn;
          if (events.constructor !== Array) events = [events];
          augur.createMarket({
            branchId: branchId,
            description: newMarketParams.description,
            alpha: "0.0079",
            initialLiquidity: newMarketParams.initialLiquidity,
            tradingFee: newMarketParams.tradingFee.toFixed(),
            events: events,
            onSent: function (r) {
              console.log("new market submitted:", r.txHash);
            },
            onSuccess: function (r) {
              console.log("new market ID:", r.callReturn);
              var marketId = abi.bignum(r.callReturn);
              flux.actions.market.deleteMarket(pendingId);
              flux.actions.market.loadMarket(marketId);
            },
            onFailed: function (r) {
              console.error("market creation failed:", r);
              flux.actions.market.deleteMarket(pendingId);
            }
          });
        }
      },
      onFailed: function (r) {
        console.error("event creation failed:", r);
        flux.actions.market.deleteMarket(pendingId);
      }
    });
    this.onHide();
  },

  handleDatePicked: function(dateText, moment, event) {

    this.setState({maturationDate: dateText});
  },

  onChangeMinimum: function (event) {
    var minimum = abi.number(event.target.value);
    this.setState({minimum: minimum});
  },

  onChangeMaximum: function (event) {
    var maximum = abi.number(event.target.value);
    this.setState({maximum: maximum});
  },

  render: function () {

    var page, subheading, footer;

    if (this.state.pageNumber === 2) {

      var cashLeft = this.state.cash - this.state.marketInvestment;
      var tradinfFeeHelp = this.state.tradingFeeError ? this.state.tradingFeeError : null;
      var tradingFeeHelpStyle = this.state.tradingFeeError ? 'error' : null;
      var marketInvestmentHelp = this.state.marketInvestmentError ? this.state.marketInvestmentError : 'CASH: '+ cashLeft.toFixed(5);
      var marketInvestmentHelpStyle = this.state.marketInvestmentError ? 'error' : null;

      subheading = 'Fees';
      page = (
        <div className="fees">

          <div className="form-horizontal">
            <Input 
              type='text'
              label='Trading fee'
              labelClassName='col-xs-3'
              help={ tradinfFeeHelp }
              bsStyle={ tradingFeeHelpStyle }
              wrapperClassName='col-xs-3'
              addonAfter='%'
              value={ this.state.tradingFee }
              onChange={ this.onChangeTradingFee }
            />
          </div>

          <p className="desc">The trading fee is the percentage taken from each purchase or sale of an outcome.  These fees are split by you and all owners of winning outcomes</p>

          <div className="form-horizontal">
            <Input 
              type="text"
              label="Initial liquidity"
              help={ marketInvestmentHelp }
              bsStyle={ marketInvestmentHelpStyle }
              labelClassName='col-xs-3'
              wrapperClassName='col-xs-3'
              value={ this.state.marketInvestment }
              onChange={ this.onChangeMarketInvestment }
            />
          </div>

          <p className="desc">The initial market liquidity is the amount of cash you wish to put in the market upfront.</p>

        </div>
      );
      footer = (
        <div className='pull-right'>
          <Button bsStyle='default' onClick={ this.onBack }>Back</Button>
          <Button bsStyle='primary' onClick={ this.onNext }>Next</Button>
        </div>
      );

    } else if (this.state.pageNumber === 3) {

      subheading = 'Maturation Date';

      page = (
        <div className="form-group date">
          <div className='col-sm-6'>
            <p>Enter the date this event will mature, trading will end and the question decided.</p>
            <Input
              className='form-control'
              bsSize='large'
              type='text'
              placeholder='YYYY-MM-DD'
              value={ this.state.maturationDate }
              onChange={ this.onChangeMaturationDate } 
            />
          </div>
          <div className='col-sm-6'>
            <DatePicker
              minDate={ this.state.minDate }
              hideFooter={ true }
              onChange={ this.handleDatePicked }
            />
          </div>
        </div>
      );
      footer = (
        <div className='pull-right'>
          <Button bsStyle='default' onClick={ this.onBack }>Back</Button>
          <Button bsStyle='primary' onClick={ this.onSubmit }>Submit Market</Button>
        </div>
      );

    } else {

      subheading = '';
      var inputStyle = this.state.marketTextError ? 'error' : null;
      // page = (
      //   <div>
      //     <p>Enter a question for the market to trade on.  This question should be easily verifiable and have an expiring date in the future.</p>
      //     <p>For example: "Will Hurricane Fatima remain a category four and make land-fall by August 8th, 2017?"</p>
      //     <Input
      //       type='textarea'
      //       help={ this.state.marketTextError }
      //       bsStyle={ inputStyle }
      //       value={ this.state.marketText }
      //       placeholder="Ask your question"
      //       onChange={ this.onChangeMarketText } 
      //     />
      //     <span className="text-count pull-right">{ this.state.marketTextCount }</span> 
      //     <p>What are the possible answers to your question?</p>
      //     <Input type='text' value='No' />
      //     <Input type='text' value='Yes' />
      //     <Button bsStyle='default' onClock={ this.addAnswer }>Add another answer</Button>
      //   </div>
      // );
      page = (
        <Tabs onSelect={ this.handleSelect } selectedIndex={ this.state.tab } >
          <TabList>
            <Tab>Yes or No</Tab>
            <Tab>Multiple Choice</Tab>
            <Tab>Numerical</Tab>
          </TabList>

          <TabPanel>
            <div>
              <p>Enter a <b>yes or no question</b> for the market to trade on.  This question should be easily verifiable and have an expiring date in the future.</p>
              <p>For example: "Will it rain in New York City on November 12, 2016?"</p>
              <Input
                type='textarea'
                help={ this.state.marketTextError }
                bsStyle={ inputStyle }
                value={ this.state.marketText }
                placeholder="Ask your yes or no question"
                onChange={ this.onChangeMarketText }
              />
              <span className="text-count pull-right">{ this.state.marketTextCount }</span>
            </div>
          </TabPanel>
          <TabPanel>
            <div>
              <p>Enter a <b>multiple choice question</b> for the market to trade on.  This question should be easily verifiable and have an expiring date in the future.</p>
              <p>For example: "Which political party's candidate will win the 2016 U.S. Presidential Election?  Choices: Democratic, Republican, Libertarian, or other"</p>
              <Input
                type='textarea'
                help={ this.state.marketTextError }
                bsStyle={ inputStyle }
                value={ this.state.marketText }
                placeholder="Ask your multiple choice question"
                onChange={ this.onChangeMarketText }
              />
              <span className="text-count pull-right">{ this.state.marketTextCount }</span>
              <p>Choices:</p>
              <div className="col-sm-12">
                <div className="col-sm-2">1.</div>
                <div className="col-sm-10"><Input type='text' value='No' onChange={ this.onChangeAnswerText } /></div>
              </div>
              <div className="col-sm-12">
                <div className="col-sm-2">2.</div>
                <div className="col-sm-10"><Input type='text' value='Yes' onChange={ this.onChangeAnswerText } /></div>
              </div>
              <Button bsStyle='default' onClock={ this.addAnswer }>Add another answer</Button>
            </div>
          </TabPanel>
          <TabPanel>
            <div>
              <p>Enter a <b>numerical question</b> for the market to trade on.  This question should be easily verifiable and have an expiring date in the future.</p>
              <p>For example: "What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2016?"</p>
              <Input
                type='textarea'
                help={ this.state.marketTextError }
                bsStyle={ inputStyle }
                value={ this.state.marketText }
                placeholder="Ask your numerical question"
                onChange={ this.onChangeMarketText }
              />
              <span className="text-count pull-right">{ this.state.marketTextCount }</span>
              <p>What are the minimum and maximum possible answers to your question?</p>
              Minimum: <Input type='text' value={ this.state.minimum } onChange={ this.onChangeMinimum } />
              Maximum: <Input type='text' value={ this.state.maximum } onChange={ this.onChangeMaximum } />
            </div>
          </TabPanel>
        </Tabs>
      );
      footer = (
        <div className='pull-right'>
          <Button bsStyle='primary' onClick={ this.onNext }>Next</Button>
        </div>
      );
    };

    return (
      <Modal {...this.props} onHide={ this.onHide } id='add-market-modal'>
        <div className="modal-header clearfix">
          <h4>Create a new market<span className='subheading pull-right'>{ subheading }</span></h4>
        </div>
        <div className="modal-body clearfix">
          { page }
        </div>
        <div className="modal-footer clearfix">
          { footer }
        </div>
      </Modal>
    );
  }
});

module.exports = AddMarketModal;
