import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';
import { augurSdk } from "services/augursdk";
import { parseBytes32String } from "ethers/utils";

export const wrapLogHandler = (logHandler: Function) => (
  log: any
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  if (log) {
    // console.info(`${new Date().toISOString()} LOG ${log.removed ? 'REMOVED' : 'ADDED'} ${log.eventName} ${JSON.stringify(log)}`)
    const universeId: string = getState().universe.id;
    if(log.eventName === "NewBlock") {
      try {
        const timeContract = augurSdk.get().contracts.getTime();
        timeContract.getTypeName_().then((timeContractTypeName) => {
          console.log(log.eventName, log.timestamp, parseBytes32String(timeContractTypeName));
        }, (err) => {
          console.log(log.eventName, log.timestamp, err.message);
        });
      } catch (e) {
        console.log(log.eventName, log.timestamp, e.message);
      }
    } else {
      console.log("event name", Array.isArray(log) ? log.length : log.eventName);
    }
    const isInCurrentUniverse = true;
    // TODO: process universe when Events have universe propety, for now assume all events are good
    // const isInCurrentUniverse = Object.values(log).find(
    //   value => universeId === value
    // );
    if (Array.isArray(log) && isInCurrentUniverse) {
      log.forEach(log => {
        if (logHandler) dispatch(logHandler(log));
      });
    }
    // TODO: will need to filter out some redundent events like token transfers in some instances
    if (isInCurrentUniverse) return dispatch(logHandler(log));
  }
};
