# Serverless Stage Environment Variables Plugin

[![serverless][sls-image]][sls-url]
[![npm package][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Dependencies Status][david-image]][david-url]
[![Downloads][downloads-image]][npm-url]

A Serverless plugin to easily use stage-specific environment variables.

## Installation

```
npm install --save-dev serverless-stage-env-vars
```

Add the plugin to serverless.yml:

```yaml
plugins:
  - serverless-stage-env-vars
```

**Note**: Node 8.x or higher runtime required.

## Usage

Define a `custom.stageEnvVars` object inside your Serverless config, and specify the default environment and a path the environment configuration file.
**This configuration is required.**

```yaml
custom:
  stageEnvVars:
    defaultEnv: dev # The name of the stage config to use if no matching stage is found
    environmentFile: path/relative/to/cwd/config.js
```

Next, define your environment config file (e.g. `path/relative/to/cwd/config.js`):

```js
// This config file is designed to contain configuration that is needed by
// APIs and websites. This config is global in nature.
const BASE_DOMAIN_NAME = 'foo.digio.com.au';

const devConfig = {
  AWS_ACCOUNT_ID: 'devAccountId',
  WEB_DOMAIN: `plugin.${BASE_DOMAIN_NAME}`, // BU: This will be dynamic based on the slice name, won't it?
  CERTIFICATE_COMMON_NAME: `*.${BASE_DOMAIN_NAME}`,
  TRACING_ENABLED: false,
};

// Export a configuration object which has top-level properties which match
// the Serverless stage names you use.
// If a matching stage name is not found, the Serverless custom.stageEnvVars.defaultEnv config
// will be used (which is 'dev' in this example)/
module.exports = {
  dev: { ...devConfig },
  prod: {
    ...devConfig,
    AWS_ACCOUNT_ID: 'prodAccountId',
    TRACING_ENABLED: true,
  },
};
```

Finally, you can refer to stage environment variables in your Servlerless config file using the `${stageEnv:VARIABLE_name}` syntax:

```yaml
provider:
  environment:
    XRAY_ENABLED: '${stageEnv:TRACING_ENABLED}'
    AWS_ACCOUNT_ID: '${stageEnv:AWS_ACCOUNT_ID}'
    ...
  tracing:
    apiGateway: '${stageEnv:TRACING_ENABLED}',
    lambda: '${stageEnv:TRACING_ENABLED}',
```

The plugin will replace those variables with the stage-specific values from your environment-config file.

[sls-image]: http://public.serverless.com/badges/v3.svg
[sls-url]: http://www.serverless.com
[npm-image]: https://img.shields.io/npm/v/serverless-stage-env-vars.svg
[npm-url]: http://npmjs.org/package/serverless-stage-env-vars
[travis-image]: https://travis-ci.org/digio/serverless-stage-env-vars.svg?branch=master
[travis-url]: https://travis-ci.org/digio/serverless-stage-env-vars
[david-image]: https://david-dm.org/digio/serverless-stage-env-vars/status.svg
[david-url]: https://david-dm.org/digio/serverless-stage-env-vars
[coveralls-image]: https://coveralls.io/repos/github/digio/serverless-stage-env-vars/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/digio/serverless-stage-env-vars?branch=master
[downloads-image]: https://img.shields.io/npm/dm/serverless-stage-env-vars.svg
