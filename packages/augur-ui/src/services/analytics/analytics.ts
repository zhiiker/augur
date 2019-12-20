import Analytics from 'analytics';
import segmentPlugin from '@analytics/segment';
import { isLocalHost } from 'utils/is-localhost';
import segmentPlugin from '@analytics/segment';

const analytics = isLocalHost() ? {} : Analytics({
  app: 'augur-ui',
  version: 3,
  plugins: [
    segmentPlugin({
      writeKey: "MaqstRWZDCkFug7IlWakWdVErxNarqi4"
    }),
    segmentPlugin({
      writeKey: "mTjvLsOUUyWObl8zkKUMAXc7TEAWqhPV"
    }),
  ],
});

export { analytics };
