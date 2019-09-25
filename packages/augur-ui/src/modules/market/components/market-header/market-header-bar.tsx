import React from 'react';
import Styles from 'modules/market/components/market-header/market-header-bar.styles.less';
import { InReportingLabel } from 'modules/common/labels';
import { Getters } from '@augurproject/sdk';

export interface MarketHeaderBarProps {
  reportingState: string;
  disputeInfo: Getters.Markets.DisputeInfo;
}

export const MarketHeaderBar = (props: MarketHeaderBarProps) => (
  <section className={Styles.HeaderBar}>
    <InReportingLabel {...props} />
  </section>
);
