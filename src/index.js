'use strict';

const path = require('path');

const STAGE_ENV_VAR_KEY = 'stageEnv';
const PLUGIN_NAME = 'serverless-stage-env-vars';

class ResolveStageVars {
  constructor(serverless) {
    this.serverless = serverless;

    this.validateConfig();

    // From https://serverless.com/framework/docs/providers/aws/guide/plugins#custom-variable-types
    this.variableResolvers = {
      [STAGE_ENV_VAR_KEY]: this.resolveStageVars.bind(this),
    };
  }

  validateConfig() {
    if (!this.serverless.service.custom) {
      this.throwError('Missing custom.stageEnvVars configuration object');
    }

    // Read the global config for the plugin.
    const config = this.serverless.service.custom.stageEnvVars;

    if (!config) {
      this.throwError('Missing custom.stageEnvVars configuration object');
    }

    this.defaultEnvConfig = config.defaultEnv;
    if (!this.defaultEnvConfig) {
      this.throwError('Missing custom.stageEnvVars.defaultEnv value');
    }

    if (!config.environmentFile) {
      this.throwError('Missing custom.stageEnvVars.environmentFile value');
    }

    try {
      this.environment = require(path.join(process.cwd(), config.environmentFile));
    } catch (err) {
      this.throwError('Unable to load file referenced in custom.stageEnvVars.environmentFile');
    }
  }

  /**
   * Utility function which throws an error.
   * Error message will be prefixed with ${PLUGIN_NAME}: ERROR:
   */
  throwError(msg) {
    const err_msg = `${PLUGIN_NAME}: ERROR: ${msg}`;
    throw new this.serverless.classes.Error(err_msg);
  }

  async resolveStageVars(rawVar) {
    const propName = rawVar.slice(STAGE_ENV_VAR_KEY.length + 1); // If rawVar = 'stageEnv:AWS_ID', will return 'AWS_ID'
    const stage = this.getStage();

    return (this.environment[stage] || this.environment[this.defaultEnvConfig])[propName];
  }

  getStage() {
    const { service, processedInput } = this.serverless;
    const { provider } = service;
    const cliOptions = (processedInput || {}).options || {};
    return cliOptions.stage || provider.stage;
  }
}

module.exports = ResolveStageVars;
