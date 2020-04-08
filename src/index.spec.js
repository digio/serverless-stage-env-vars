const Plugin = require('./index.js');
const slsConfig = require('../fixtures/serverless.correct.json');

function getConfig({ stage } = {}) {
  const config = JSON.parse(JSON.stringify(slsConfig)); // cheap deep copy

  // Mock the config.classes.Error class
  config.classes = {
    Error: Error,
  };

  if (stage) {
    delete config.processedInput;
    config.service.provider.stage = stage;
  }
  return config;
}

describe('Serverless plugin', () => {
  describe('setup', () => {
    it('should throw an error if there is no custom configuration object', () => {
      const config = getConfig();
      delete config.service.custom;

      expect(() => new Plugin(config)).toThrowError('Missing custom.stageEnvVars configuration object');
    });

    it('should throw an error if there is no custom configuration object with a stageEnvVars prop', () => {
      const config = getConfig();
      delete config.service.custom.stageEnvVars;

      expect(() => new Plugin(config)).toThrowError('Missing custom.stageEnvVars configuration object');
    });

    it('should throw an error if there is no defaultEnv prop', () => {
      const config = getConfig();
      delete config.service.custom.stageEnvVars.defaultEnv;

      expect(() => new Plugin(config)).toThrowError('Missing custom.stageEnvVars.defaultEnv value');
    });

    it('should throw an error if there is no environmentFile prop', () => {
      const config = getConfig();
      delete config.service.custom.stageEnvVars.environmentFile;

      expect(() => new Plugin(config)).toThrowError('Missing custom.stageEnvVars.environmentFile value');
    });

    it('should throw an error if the environmentFile references an unloadable file', () => {
      const config = getConfig();
      config.service.custom.stageEnvVars.environmentFile = 'unknownfile';

      expect(() => new Plugin(config)).toThrowError(
        'Unable to load file referenced in custom.stageEnvVars.environmentFile'
      );
    });
  });

  describe('variable resolution', () => {
    it('should resolve stage variables using the defaultEnv when there is no config for the current stage (pre-prod)', async () => {
      const config = getConfig();
      const plugin = new Plugin(config);

      // The environments file (environment.config.js) has prod and dev stages
      // The serverless config has a stage 'pre-prod', and a defaultEnv of 'dev'
      // So the variables will resolve to the values in the 'dev' section of environment.config.js
      expect(await plugin.resolveStageVars('stageEnv:AWS_ACCOUNT_ID')).toEqual('devAccountId');
      expect(await plugin.resolveStageVars('stageEnv:TRACING_ENABLED')).toEqual(false);
    });

    it('should resolve stage variables using the prod config when the stage is prod', async () => {
      const config = getConfig({ stage: 'prod' });
      const plugin = new Plugin(config);

      expect(await plugin.resolveStageVars('stageEnv:AWS_ACCOUNT_ID')).toEqual('prodAccountId');
      expect(await plugin.resolveStageVars('stageEnv:TRACING_ENABLED')).toEqual(true);
    });

    it('should resolve stage variables using dev config when the stage is dev', async () => {
      const config = getConfig({ stage: 'dev' });
      const plugin = new Plugin(config);

      expect(await plugin.resolveStageVars('stageEnv:AWS_ACCOUNT_ID')).toEqual('devAccountId');
      expect(await plugin.resolveStageVars('stageEnv:TRACING_ENABLED')).toEqual(false);
    });
  });
});
