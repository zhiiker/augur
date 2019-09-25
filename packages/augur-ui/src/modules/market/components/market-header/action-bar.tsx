import React, { useEffect } from 'react';
import Clipboard from 'clipboard';

import { FavoritesButton } from 'modules/common/buttons';
import { WordTrail, MarketTypeLabel } from 'modules/common/labels';
import { CopySelection } from 'modules/common/selection';
import {
  LeftChevron,
  Facebook,
  Twitter,
  CopySquares
} from 'modules/common/icons';

import Styles from 'modules/market/components/market-header/action-bar.styles';

interface ButtonObj {
  label: string;
  onClick: Function;
}

interface ActionBarProps {
  categoriesWithClick: Array<ButtonObj>;
  addToFavorites: Function;
  onClickBack: Function;
  isFavorite: boolean;
  isLogged: boolean;
  isCollapsed: boolean;
  marketId: string;
  author: string;
  marketType: string;
}

export const ActionBar = ({
  categoriesWithClick,
  addToFavorites,
  onClickBack,
  isFavorite,
  isLogged,
  isCollapsed,
  marketId,
  author,
  marketType,
}: ActionBarProps) => {
  useEffect(() => {
    new Clipboard('#copy_marketId');
  });

  return (
    <div className={Styles.ActionBar}>
      <WordTrail items={[...categoriesWithClick]}>
        <button className={Styles.BackButton} onClick={() => onClickBack()}>
          {LeftChevron} Back
        </button>
        <MarketTypeLabel marketType={marketType} />
      </WordTrail>
      <button onClick={e => e.preventDefault()}>{Facebook}</button>
      <button onClick={e => e.preventDefault()}>{Twitter}</button>
      <button
        id="copy_marketId"
        data-clipboard-text={marketId}
        onClick={e => e.preventDefault()}
      >
        {CopySquares}
      </button>
      {addToFavorites && (
        <FavoritesButton
          action={() => addToFavorites()}
          isFavorite={isFavorite}
          hideText
          disabled={!isLogged}
        />
      )}
    </div>
  );
};
