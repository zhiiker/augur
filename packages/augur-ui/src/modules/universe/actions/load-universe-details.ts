import { augurSdk } from 'services/augursdk';
import { ThunkAction } from 'redux-thunk';
import { updateUniverse } from 'modules/universe/actions/update-universe';

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
  const universeDetails= await augur.getUniverseChildren
  ({
    universeId,
    account
  });
console.log(universeDetails)
  dispatch(updateUniverse({ ...universeDetails }));
}
