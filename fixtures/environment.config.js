'use strict';

// This config file is designed to contain configuration that is needed by
// APIs and websites. This config is global in nature.
const BASE_DOMAIN_NAME = 'foo.digio.com.au';

const devConfig = {
  AWS_ACCOUNT_ID: 'devAccountId',
  WEB_DOMAIN: `plugin.${BASE_DOMAIN_NAME}`, // BU: This will be dynamic based on the slice name, won't it?
  CERTIFICATE_COMMON_NAME: `*.${BASE_DOMAIN_NAME}`,
  TRACING_ENABLED: false,
};

module.exports = Object.freeze({
  dev: { ...devConfig },
  prod: {
    ...devConfig,
    AWS_ACCOUNT_ID: 'prodAccountId',
    TRACING_ENABLED: true,
  },
});
