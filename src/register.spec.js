import register from './register';

jest.mock('react-native', () => ({
  NativeModules: {
    RNAppAuth: {
      register: jest.fn(),
    },
  },
  Platform: {
    OS: 'ios',
  },
}));

describe('register', () => {
  let mockRegister;

  beforeAll(() => {
    mockRegister = require('react-native').NativeModules.RNAppAuth.register;
    mockRegister.mockReturnValue('REGISTERED');
  });

  const registerConfig = {
    issuer: 'test-issuer',
    redirectUrls: ['test-redirectUrl'],
    responseTypes: ['code'],
    grantTypes: ['authorization_code'],
    subjectType: 'public',
    tokenEndpointAuthMethod: 'client_secret_post',
    additionalParameters: {},
    serviceConfiguration: null,
  };

  beforeEach(() => {
    mockRegister.mockReset();
  });

  it('throws an error when issuer is not a string and serviceConfiguration is not passed', () => {
    expect(() => {
      register({ ...registerConfig, issuer: () => ({}) });
    }).toThrow('Config error: you must provide either an issuer or a registration endpoint');
  });

  it('throws an error when serviceConfiguration does not have registrationEndpoint and issuer is not passed', () => {
    expect(() => {
      register({
        ...registerConfig,
        issuer: undefined,
        serviceConfiguration: { authorizationEndpoint: '' },
      });
    }).toThrow('Config error: you must provide either an issuer or a registration endpoint');
  });

  it('throws an error when redirectUrls is not an Array', () => {
    expect(() => {
      register({ ...registerConfig, redirectUrls: 'test-url' });
    }).toThrow('Config error: redirectUrls must be an Array of strings');
  });

  it('throws an error when redirectUrls does not contain strings', () => {
    expect(() => {
      register({ ...registerConfig, redirectUrls: [null] });
    }).toThrow('Config error: redirectUrls must be an Array of strings');
  });

  it('throws an error when responseTypes is not an Array', () => {
    expect(() => {
      register({ ...registerConfig, responseTypes: 'test-type' });
    }).toThrow('Config error: if provided, responseTypes must be an Array of strings');
  });

  it('throws an error when responseTypes does not contain strings', () => {
    expect(() => {
      register({ ...registerConfig, responseTypes: [null] });
    }).toThrow('Config error: if provided, responseTypes must be an Array of strings');
  });

  it('throws an error when grantTypes is not an Array', () => {
    expect(() => {
      register({ ...registerConfig, grantTypes: 'test-type' });
    }).toThrow('Config error: if provided, grantTypes must be an Array of strings');
  });

  it('throws an error when grantTypes does not contain strings', () => {
    expect(() => {
      register({ ...registerConfig, grantTypes: [null] });
    }).toThrow('Config error: if provided, grantTypes must be an Array of strings');
  });

  it('throws an error when subjectType is not a string', () => {
    expect(() => {
      register({ ...registerConfig, subjectType: 7 });
    }).toThrow('Config error: if provided, subjectType must be a string');
  });

  it('throws an error when tokenEndpointAuthMethod is not a string', () => {
    expect(() => {
      register({ ...registerConfig, tokenEndpointAuthMethod: () => 'test-method' });
    }).toThrow('Config error: if provided, tokenEndpointAuthMethod must be a string');
  });

  it('throws an error when customHeaders has too few keys', () => {
    expect(() => {
      register({ ...registerConfig, customHeaders: {} });
    }).toThrow();
  });

  it('throws an error when customHeaders has too many keys', () => {
    expect(() => {
      register({
        ...registerConfig,
        customHeaders: {
          register: { toto: 'titi' },
          authorize: { toto: 'titi' },
          unknownKey: { toto: 'titi' },
        },
      });
    }).toThrow();
  });

  it('throws an error when customHeaders has unknown keys', () => {
    expect(() => {
      register({
        ...registerConfig,
        customHeaders: {
          reg: { toto: 'titi' },
          authorize: { toto: 'titi' },
        },
      });
    }).toThrow();
    expect(() => {
      register({
        ...registerConfig,
        customHeaders: {
          reg: { toto: 'titi' },
        },
      });
    }).toThrow();
  });

  it('throws an error when customHeaders values arent Record<string,string>', () => {
    expect(() => {
      register({
        ...registerConfig,
        customHeaders: {
          register: { toto: {} },
        },
      });
    }).toThrow();
  });

  it('calls the native wrapper with the correct args on iOS', () => {
    register(registerConfig);
    expect(mockRegister).toHaveBeenCalledWith(
      registerConfig.issuer,
      registerConfig.redirectUrls,
      registerConfig.responseTypes,
      registerConfig.grantTypes,
      registerConfig.subjectType,
      registerConfig.tokenEndpointAuthMethod,
      registerConfig.additionalParameters,
      registerConfig.serviceConfiguration
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
        register(registerConfig);
        expect(mockRegister).toHaveBeenCalledWith(
          registerConfig.issuer,
          registerConfig.redirectUrls,
          registerConfig.responseTypes,
          registerConfig.grantTypes,
          registerConfig.subjectType,
          registerConfig.tokenEndpointAuthMethod,
          registerConfig.additionalParameters,
          registerConfig.serviceConfiguration,
          false,
          registerConfig.customHeaders
        );
      });

      it('calls the native wrapper with passed value `false`', () => {
        register({ ...registerConfig, dangerouslyAllowInsecureHttpRequests: false });
        expect(mockRegister).toHaveBeenCalledWith(
          registerConfig.issuer,
          registerConfig.redirectUrls,
          registerConfig.responseTypes,
          registerConfig.grantTypes,
          registerConfig.subjectType,
          registerConfig.tokenEndpointAuthMethod,
          registerConfig.additionalParameters,
          registerConfig.serviceConfiguration,
          false,
          registerConfig.customHeaders
        );
      });

      it('calls the native wrapper with passed value `true`', () => {
        register({ ...registerConfig, dangerouslyAllowInsecureHttpRequests: true });
        expect(mockRegister).toHaveBeenCalledWith(
          registerConfig.issuer,
          registerConfig.redirectUrls,
          registerConfig.responseTypes,
          registerConfig.grantTypes,
          registerConfig.subjectType,
          registerConfig.tokenEndpointAuthMethod,
          registerConfig.additionalParameters,
          registerConfig.serviceConfiguration,
          true,
          registerConfig.customHeaders
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
        register({ ...registerConfig, customHeaders });
        expect(mockRegister).toHaveBeenCalledWith(
          registerConfig.issuer,
          registerConfig.redirectUrls,
          registerConfig.responseTypes,
          registerConfig.grantTypes,
          registerConfig.subjectType,
          registerConfig.tokenEndpointAuthMethod,
          registerConfig.additionalParameters,
          registerConfig.serviceConfiguration,
          false,
          customHeaders
        );
      });
    });
  });
});
