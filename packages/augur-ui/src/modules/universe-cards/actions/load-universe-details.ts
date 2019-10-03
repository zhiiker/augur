import { augurSdk } from 'services/augursdk';
import { ThunkAction } from 'redux-thunk';

export const loadUniverseDetails = (
  universeId: string,
  account: string
): ThunkAction<any, any, any, any> => async (
  dispatch,
  getState
) => {
  const { universe } = getState();
  if (!(universe && universe.id)) return;

  const augur = augurSdk.get();

  return augur.getUniverseChildren({
    universeId,
    account
  });
}
