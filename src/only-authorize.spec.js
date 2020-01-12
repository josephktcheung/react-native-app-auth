import onlyAuthorize from './only-authorize';

jest.mock('react-native', () => ({
  NativeModules: {
    RNAppAuth: {
      onlyAuthorize: jest.fn(),
    },
  },
  Platform: {
    OS: 'ios',
  },
}));

describe('onlyAuthorize', () => {
  let mockAuthorize;

  beforeAll(() => {
    mockAuthorize = require('react-native').NativeModules.RNAppAuth.onlyAuthorize;
    mockAuthorize.mockReturnValue('AUTHORIZED');
  });

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

  beforeEach(() => {
    mockAuthorize.mockReset();
  });

  it('throws an error when issuer is not a string and serviceConfiguration is not passed', () => {
    expect(() => {
      onlyAuthorize({ ...config, issuer: () => ({}) });
    }).toThrow('Config error: you must provide either an issuer or a service endpoints');
  });

  it('throws an error when serviceConfiguration does not have tokenEndpoint and issuer is not passed', () => {
    expect(() => {
      onlyAuthorize({
        ...config,
        issuer: undefined,
        serviceConfiguration: { authorizationEndpoint: '' },
      });
    }).toThrow('Config error: you must provide either an issuer or a service endpoints');
  });

  it('throws an error when serviceConfiguration does not have tokenEndpoint and issuer is not passed', () => {
    expect(() => {
      onlyAuthorize({
        ...config,
        issuer: undefined,
        serviceConfiguration: { authorizationEndpoint: '' },
      });
    }).toThrow('Config error: you must provide either an issuer or a service endpoints');
  });

  it('throws an error when redirectUrl is not a string', () => {
    expect(() => {
      onlyAuthorize({ ...config, redirectUrl: {} });
    }).toThrow('Config error: redirectUrl must be a string');
  });

  it('throws an error when clientId is not a string', () => {
    expect(() => {
      onlyAuthorize({ ...config, clientId: 123 });
    }).toThrow('Config error: clientId must be a string');
  });

  it('throws an error when customHeaders has too few keys', () => {
    expect(() => {
      onlyAuthorize({ ...config, customHeaders: {} });
    }).toThrow();
  });

  it('throws an error when customHeaders has too many keys', () => {
    expect(() => {
      onlyAuthorize({
        ...config,
        customHeaders: {
          token: { toto: 'titi' },
          authorize: { toto: 'titi' },
          unknownKey: { toto: 'titi' },
        },
      });
    }).toThrow();
  });

  it('throws an error when customHeaders has unknown keys', () => {
    expect(() => {
      onlyAuthorize({
        ...config,
        customHeaders: {
          tokn: { toto: 'titi' },
          authorize: { toto: 'titi' },
        },
      });
    }).toThrow();
    expect(() => {
      onlyAuthorize({
        ...config,
        customHeaders: {
          tokn: { toto: 'titi' },
        },
      });
    }).toThrow();
  });
  it('throws an error when customHeaders values arent Record<string,string>', () => {
    expect(() => {
      onlyAuthorize({
        ...config,
        customHeaders: {
          token: { toto: {} },
        },
      });
    }).toThrow();
  });

  it('calls the native wrapper with the correct args on iOS', () => {
    onlyAuthorize(config);
    expect(mockAuthorize).toHaveBeenCalledWith(
      config.issuer,
      config.redirectUrl,
      config.clientId,
      config.clientSecret,
      config.scopes,
      config.additionalParameters,
      config.serviceConfiguration,
      config.useNonce,
      config.usePKCE
    );
  });

  describe('Android-specific', () => {
    beforeEach(() => {
      require('react-native').Platform.OS = 'android';
    });

    afterEach(() => {
      require('react-native').Platform.OS = 'ios';
    });
    describe('dangerouslyAllowInsecureHttpRequests parameter', () => {
      it('calls the native wrapper with default value `false`', () => {
        onlyAuthorize(config);
        expect(mockAuthorize).toHaveBeenCalledWith(
          config.issuer,
          config.redirectUrl,
          config.clientId,
          config.clientSecret,
          config.scopes,
          config.additionalParameters,
          config.serviceConfiguration,
          config.usePKCE,
          config.clientAuthMethod,
          false,
          config.customHeaders
        );
      });

      it('calls the native wrapper with passed value `false`', () => {
        onlyAuthorize({ ...config, dangerouslyAllowInsecureHttpRequests: false });
        expect(mockAuthorize).toHaveBeenCalledWith(
          config.issuer,
          config.redirectUrl,
          config.clientId,
          config.clientSecret,
          config.scopes,
          config.additionalParameters,
          config.serviceConfiguration,
          config.usePKCE,
          config.clientAuthMethod,
          false,
          config.customHeaders
        );
      });

      it('calls the native wrapper with passed value `true`', () => {
        onlyAuthorize({ ...config, dangerouslyAllowInsecureHttpRequests: true });
        expect(mockAuthorize).toHaveBeenCalledWith(
          config.issuer,
          config.redirectUrl,
          config.clientId,
          config.clientSecret,
          config.scopes,
          config.additionalParameters,
          config.serviceConfiguration,
          config.usePKCE,
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
        const customRegisterHeaders = { Authorization: 'Basic some3rdBase64Value' };
        const customHeaders = {
          token: customTokenHeaders,
          authorize: customAuthorizeHeaders,
          register: customRegisterHeaders,
        };
        onlyAuthorize({ ...config, customHeaders });
        expect(mockAuthorize).toHaveBeenCalledWith(
          config.issuer,
          config.redirectUrl,
          config.clientId,
          config.clientSecret,
          config.scopes,
          config.additionalParameters,
          config.serviceConfiguration,
          config.usePKCE,
          config.clientAuthMethod,
          false,
          customHeaders
        );
      });
    });

    describe('iOS-specific useNonce parameter', () => {
      beforeEach(() => {
        require('react-native').Platform.OS = 'ios';
      });

      it('calls the native wrapper with default value `true`', () => {
        onlyAuthorize(config, { refreshToken: 'such-token' });
        expect(mockAuthorize).toHaveBeenCalledWith(
          config.issuer,
          config.redirectUrl,
          config.clientId,
          config.clientSecret,
          config.scopes,
          config.additionalParameters,
          config.serviceConfiguration,
          true,
          true
        );
      });

      it('calls the native wrapper with passed value `false`', () => {
        onlyAuthorize({ ...config, useNonce: false }, { refreshToken: 'such-token' });
        expect(mockAuthorize).toHaveBeenCalledWith(
          config.issuer,
          config.redirectUrl,
          config.clientId,
          config.clientSecret,
          config.scopes,
          config.additionalParameters,
          config.serviceConfiguration,
          false,
          true
        );
      });
    });

    describe('iOS-specific usePKCE parameter', () => {
      beforeEach(() => {
        require('react-native').Platform.OS = 'ios';
      });

      it('calls the native wrapper with default value `true`', () => {
        onlyAuthorize(config, { refreshToken: 'such-token' });
        expect(mockAuthorize).toHaveBeenCalledWith(
          config.issuer,
          config.redirectUrl,
          config.clientId,
          config.clientSecret,
          config.scopes,
          config.additionalParameters,
          config.serviceConfiguration,
          config.useNonce,
          true
        );
      });

      it('calls the native wrapper with passed value `false`', () => {
        onlyAuthorize({ ...config, usePKCE: false }, { refreshToken: 'such-token' });
        expect(mockAuthorize).toHaveBeenCalledWith(
          config.issuer,
          config.redirectUrl,
          config.clientId,
          config.clientSecret,
          config.scopes,
          config.additionalParameters,
          config.serviceConfiguration,
          config.useNonce,
          false
        );
      });
    });
  });
});
