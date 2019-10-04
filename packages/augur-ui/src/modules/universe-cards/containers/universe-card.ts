import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppState } from 'store';
import { UniverseCard } from 'modules/universe-cards/components/universe-card';
// import { toggleFavorite } from 'modules/markets/actions/update-favorites';
// import { hasStakeInMarket } from 'modules/account/selectors/has-stake-in-market';
// import { MIGRATE_MARKET_GAS_ESTIMATE, MODAL_MIGRATE_MARKET, MODAL_REPORTING } from 'modules/common/constants';
// import { updateModal } from 'modules/modal/actions/update-modal';
import { switchUniverse } from 'modules/universe-cards/actions/switch-universe';

const mapStateToProps = (state: AppState) => {
  // const positions = state.accountPositions;
  // return {
  //   hasPosition: !!positions[ownProps.market.marketId],
  //   isLogged: state.authStatus.isLogged,
  //   isMobile: state.appStatus.isMobile,
  //   pendingLiquidityOrders: state.pendingLiquidityOrders,
  //   currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
  //   disputingWindowEndTime: state.universe.disputeWindow.endTime,
  //   address: state.loginAccount.address,
  //   isFavorite: !!state.favorites[ownProps.market.marketId],
  //   hasStaked,
  // };
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  // toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
  // dispute: (selectedOutcome: string) =>
  //   dispatch(
  //     updateModal({
  //       type: MODAL_REPORTING,
  //       market: ownProps.market,
  //       selectedOutcome,
  //     })
  //   ),
  // migrateMarketModal: () =>
  //   dispatch(
  //     updateModal({
  //       type: MODAL_MIGRATE_MARKET,
  //       market: ownProps.market,
  //     })
  //   ),
  return {
    switchUniverse: (universeId: string) => dispatch(switchUniverse(universeId)),
  };
};

const mergeProps = (sP: any, dP: any, oP: any) => {
console.log("MERGE PROPS");
console.log(sP);
console.log(dP);
console.log(oP);
//   const { loginAccount } = sP;
//   const universeDetails = loadUniverseDetails(sP.universeI, state.loginAccount.address);
// console.log(universeDetails);
//   return universeDetails;
// console.log(sP.loadUniverseDetails(universe.id, loginAccount.address));
  return {
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(UniverseCard)
);
