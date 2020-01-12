import refresh from './refresh';

jest.mock('react-native', () => ({
  NativeModules: {
    RNAppAuth: {
      refresh: jest.fn(),
    },
  },
  Platform: {
    OS: 'ios',
  },
}));

const config = {
  issuer: 'test-issuer',
  redirectUrl: 'test-redirectUrl',
  clientId: 'test-clientId',
  clientSecret: 'test-clientSecret',
  additionalParameters: { hello: 'world' },
  clientAuthMethod: 'post',
  serviceConfiguration: null,
  scopes: ['my-scope'],
  useNonce: true,
  usePKCE: true,
  customHeaders: null,
};

describe('refresh', () => {
  let mockRefresh;

  beforeAll(() => {
    mockRefresh = require('react-native').NativeModules.RNAppAuth.refresh;
    mockRefresh.mockReturnValue('REFRESHED');
  });

  beforeEach(() => {
    mockRefresh.mockReset();
  });

  it('throws an error when issuer is not a string and serviceConfiguration is not passed', () => {
    expect(() => {
      refresh({ ...config, issuer: () => ({}) }, {});
    }).toThrow('Config error: you must provide either an issuer or a service endpoints');
  });

  it('throws an error when serviceConfiguration does not have tokenEndpoint and issuer is not passed', () => {
    expect(() => {
      refresh(
        {
          ...config,
          issuer: undefined,
          serviceConfiguration: { authorizationEndpoint: '' },
        },
        {}
      );
    }).toThrow('Config error: you must provide either an issuer or a service endpoints');
  });

  it('throws an error when serviceConfiguration does not have tokenEndpoint and issuer is not passed', () => {
    expect(() => {
      refresh(
        {
          ...config,
          issuer: undefined,
          serviceConfiguration: { authorizationEndpoint: '' },
        },
        {}
      );
    }).toThrow('Config error: you must provide either an issuer or a service endpoints');
  });

  it('throws an error when redirectUrl is not a string', () => {
    expect(() => {
      refresh({ ...config, redirectUrl: {} }, {});
    }).toThrow('Config error: redirectUrl must be a string');
  });

  it('throws an error when clientId is not a string', () => {
    expect(() => {
      refresh({ ...config, clientId: 123 }, {});
    }).toThrow('Config error: clientId must be a string');
  });

  it('throws an error when no refreshToken is passed in', () => {
    expect(() => {
      refresh(config, {});
    }).toThrow('Please pass in a refresh token');
  });

  it('calls the native wrapper with the correct args on iOS', () => {
    refresh({ ...config }, { refreshToken: 'such-token' });
    expect(mockRefresh).toHaveBeenCalledWith(
      config.issuer,
      config.redirectUrl,
      config.clientId,
      config.clientSecret,
      'such-token',
      config.scopes,
      config.additionalParameters,
      config.serviceConfiguration
    );
  });

  describe('Android-specific', () => {
    beforeEach(() => {
      require('react-native').Platform.OS = 'android';
    });

    afterEach(() => {
      require('react-native').Platform.OS = 'ios';
    });
    describe(' dangerouslyAllowInsecureHttpRequests parameter', () => {
      it('calls the native wrapper with default value `false`', () => {
        refresh(config, { refreshToken: 'such-token' });
        expect(mockRefresh).toHaveBeenCalledWith(
          config.issuer,
          config.redirectUrl,
          config.clientId,
          config.clientSecret,
          'such-token',
          config.scopes,
          config.additionalParameters,
          config.serviceConfiguration,
          config.clientAuthMethod,
          false,
          config.customHeaders
        );
      });

      it('calls the native wrapper with passed value `false`', () => {
        refresh(
          { ...config, dangerouslyAllowInsecureHttpRequests: false },
          { refreshToken: 'such-token' }
        );
        expect(mockRefresh).toHaveBeenCalledWith(
          config.issuer,
          config.redirectUrl,
          config.clientId,
          config.clientSecret,
          'such-token',
          config.scopes,
          config.additionalParameters,
          config.serviceConfiguration,
          config.clientAuthMethod,
          false,
          config.customHeaders
        );
      });

      it('calls the native wrapper with passed value `true`', () => {
        refresh(
          { ...config, dangerouslyAllowInsecureHttpRequests: true },
          { refreshToken: 'such-token' }
        );
        expect(mockRefresh).toHaveBeenCalledWith(
          config.issuer,
          config.redirectUrl,
          config.clientId,
          config.clientSecret,
          'such-token',
          config.scopes,
          config.additionalParameters,
          config.serviceConfiguration,
          config.clientAuthMethod,
          true,
          config.customHeaders
        );
      });
    });

    describe('customHeaders parameter', () => {
      it('calls the native wrapper with headers', () => {
        const customTokenHeaders = { Authorization: 'Basic someBase64Value' };
        const customAuthorizeHeaders = { Authorization: 'Basic someOtherBase64Value' };
        const customHeaders = { token: customTokenHeaders, authorize: customAuthorizeHeaders };
        refresh({ ...config, customHeaders }, { refreshToken: 'such-token' });
        expect(mockRefresh).toHaveBeenCalledWith(
          config.issuer,
          config.redirectUrl,
          config.clientId,
          config.clientSecret,
          'such-token',
          config.scopes,
          config.additionalParameters,
          config.serviceConfiguration,
          config.clientAuthMethod,
          false,
          customHeaders
        );
      });
    });
  });
});
