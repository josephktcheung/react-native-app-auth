export interface ServiceConfiguration {
  authorizationEndpoint: string;
  tokenEndpoint: string;
  revocationEndpoint?: string;
  registrationEndpoint?: string;
}

export type BaseConfiguration =
  | {
      issuer?: string;
      serviceConfiguration: ServiceConfiguration;
    }
  | {
      issuer: string;
      serviceConfiguration?: ServiceConfiguration;
    };

type CustomHeaders = {
  authorize?: Record<string, string>;
  token?: Record<string, string>;
  register?: Record<string, string>;
};

interface BuiltInRegistrationParameters {
  client_name?: string;
  logo_uri?: string;
  client_uri?: string;
  policy_uri?: string;
  tos_uri?: string;
}

export type RegistrationConfiguration = BaseConfiguration & {
  redirectUrls: string[];
  responseTypes?: string[];
  grantTypes?: string[];
  subjectType?: string;
  tokenEndpointAuthMethod?: string;
  additionalParameters?: BuiltInRegistrationParameters & { [name: string]: string };
  dangerouslyAllowInsecureHttpRequests?: boolean;
  customHeaders?: CustomHeaders;
};

export interface RegistrationResponse {
  clientId: string;
  additionalParameters?: { [name: string]: string };
  clientIdIssuedAt?: string;
  clientSecret?: string;
  clientSecretExpiresAt?: string;
  registrationAccessToken?: string;
  registrationClientUri?: string;
  tokenEndpointAuthMethod?: string;
}

interface BuiltInParameters {
  display?: 'page' | 'popup' | 'touch' | 'wap';
  login_prompt?: string;
  prompt?: 'consent' | 'login' | 'none' | 'select_account';
}

export type BaseAuthConfiguration = BaseConfiguration & {
  clientId: string;
};

export type AuthConfiguration = BaseAuthConfiguration & {
  clientSecret?: string;
  scopes: string[];
  redirectUrl: string;
  additionalParameters?: BuiltInParameters & { [name: string]: string };
  clientAuthMethod?: 'basic' | 'post';
  dangerouslyAllowInsecureHttpRequests?: boolean;
  customHeaders?: CustomHeaders;
  useNonce?: boolean;
  usePKCE?: boolean;
};

export type TokenExchangeConfiguration = {
  clientSecret?: string;
  additionalParameters?: { [name: string]: string };
  dangerouslyAllowInsecureHttpRequests?: boolean;
};

export interface AuthorizeResult {
  additionalParameters: { [name: string]: string };
  scopes: [string];
  authorizationCode: string;
  state: string;
}

export interface RefreshResult {
  accessToken: string;
  accessTokenExpirationDate: string;
  additionalParameters: { [name: string]: string };
  idToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface TokenExchangeResult {
  accessToken: string;
  additionalParameters: { [name: string]: string };
  idToken: string;
  refreshToken: string;
  tokenType: string;
  accessTokenExpirationTime?: string;
}

export interface RevokeConfiguration {
  tokenToRevoke: string;
  sendClientId?: boolean;
  includeBasicAuthorization?: boolean;
}

export interface RefreshConfiguration {
  refreshToken: string;
}

export interface AuthorizeAndTokenResult {
  authorizeResult: AuthorizeResult;
  tokenResult: TokenExchangeResult;
}

export function onlyAuthorize(config: AuthConfiguration): Promise<AuthorizeResult>;

export function onlyTokenExchange(config: TokenExchangeConfiguration): Promise<TokenExchangeResult>;

export function authorize(config: AuthConfiguration): Promise<AuthorizeAndTokenResult>;

export function prefetchConfiguration(config: AuthConfiguration): Promise<void>;

export function register(config: RegistrationConfiguration): Promise<RegistrationResponse>;

export function authorize(config: AuthConfiguration): Promise<AuthorizeResult>;

export function refresh(
  config: AuthConfiguration,
  refreshConfig: RefreshConfiguration
): Promise<RefreshResult>;

export function revoke(
  config: BaseAuthConfiguration,
  revokeConfig: RevokeConfiguration
): Promise<void>;
