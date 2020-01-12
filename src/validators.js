import invariant from 'invariant';

export const validateIssuerOrServiceConfigurationEndpoints = (issuer, serviceConfiguration) =>
  invariant(
    typeof issuer === 'string' ||
      (serviceConfiguration &&
        typeof serviceConfiguration.authorizationEndpoint === 'string' &&
        typeof serviceConfiguration.tokenEndpoint === 'string'),
    'Config error: you must provide either an issuer or a service endpoints'
  );
export const validateIssuerOrServiceConfigurationRegistrationEndpoint = (
  issuer,
  serviceConfiguration
) =>
  invariant(
    typeof issuer === 'string' ||
      (serviceConfiguration && typeof serviceConfiguration.registrationEndpoint === 'string'),
    'Config error: you must provide either an issuer or a registration endpoint'
  );

export const validateIssuerOrServiceConfigurationRevocationEndpoint = (
  issuer,
  serviceConfiguration
) =>
  invariant(
    typeof issuer === 'string' ||
      (serviceConfiguration && typeof serviceConfiguration.revocationEndpoint === 'string'),
    'Config error: you must provide either an issuer or a revocation endpoint'
  );
export const validateClientId = clientId =>
  invariant(typeof clientId === 'string', 'Config error: clientId must be a string');

export const validateRedirectUrl = redirectUrl =>
  invariant(typeof redirectUrl === 'string', 'Config error: redirectUrl must be a string');

export const validateHeaders = headers => {
  if (!headers) {
    return;
  }
  const customHeaderTypeErrorMessage =
    'Config error: customHeaders type must be { token?: { [key: string]: string }, authorize?: { [key: string]: string }, register: { [key: string]: string }}';

  const authorizedKeys = ['token', 'authorize', 'register'];
  const keys = Object.keys(headers);
  const correctKeys = keys.filter(key => authorizedKeys.includes(key));
  invariant(
    keys.length <= authorizedKeys.length &&
      correctKeys.length > 0 &&
      correctKeys.length === keys.length,
    customHeaderTypeErrorMessage
  );

  Object.values(headers).forEach(value => {
    invariant(typeof value === 'object', customHeaderTypeErrorMessage);
    invariant(
      Object.values(value).filter(key => typeof key !== 'string').length === 0,
      customHeaderTypeErrorMessage
    );
  });
};
