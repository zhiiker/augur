import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import { LANDING, SCRATCH, TEMPLATE } from "modules/create-market/constants";

import Form from "modules/create-market/containers/form";
import Landing from "modules/create-market/containers/landing";
import Styles from "modules/create-market/components/create-market-view/create-market-view.styles.less";

import UniverseCard from 'modules/universe-cards/containers/universe-card';
import { UniverseDetails } from '@augurproject/sdk/src/state/getter/Universe';
import { loadUniverseDetails } from "modules/universe-cards/actions/load-universe-details";
interface CreateMarketViewProps {
  universe: universe;
}

interface CreateMarketViewPState {
  selected: number;
  page: number;
}

export default class CreateMarketView extends React.Component<
  CreateMarketViewProps,
  CreateMarketViewState
> {
  state: FormState = {
    page: this.props.history.location.state || LANDING
  };

  updatePage = (page: string) => {
    this.setState({page});
  }

  render() {
    const { loginAccount, page, universe } = this.state;

    console.log("?????")
    console.log(this.state);
    console.log(this.props);
    const universeDetails = loadUniverseDetails(this.props.universe.id, this.props.loginAccount);
    console.log(universeDetails);
    return (
      <section className={Styles.CreateMarketView}>
        {/* <UniverseCard
          universeDetails={this.props.universeDetails}
        /> */}
        <Helmet>
          <title>Create Market</title>
        </Helmet>
        {page === LANDING &&
          <Landing updatePage={this.updatePage} />
        }
        {page === SCRATCH && <Form {...this.props} updatePage={this.updatePage} />}
      </section>
    );
  }
}

CreateMarketView.propTypes = {
  isMobileSmall: PropTypes.bool.isRequired,
  currentTimestamp: PropTypes.number.isRequired,
  gasPrice: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  newMarket: PropTypes.object.isRequired,
  universe: PropTypes.object.isRequired,
  addOrderToNewMarket: PropTypes.func.isRequired,
  estimateSubmitNewMarket: PropTypes.func.isRequired,
  removeOrderFromNewMarket: PropTypes.func.isRequired,
  submitNewMarket: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired,
  meta: PropTypes.object.isRequired,
  availableEth: PropTypes.number,
  availableRep: PropTypes.number
};

CreateMarketView.defaultProps = {
  availableEth: 0,
  availableRep: 0
};
