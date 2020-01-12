import { Platform, NativeModules } from 'react-native';

import {
  validateIssuerOrServiceConfigurationEndpoints,
  validateClientId,
  validateRedirectUrl,
  validateHeaders,
} from './validators';

const { RNAppAuth } = NativeModules;

export const prefetchConfiguration = async ({
  warmAndPrefetchChrome,
  issuer,
  redirectUrl,
  clientId,
  scopes,
  serviceConfiguration,
  dangerouslyAllowInsecureHttpRequests = false,
  customHeaders,
}) => {
  if (Platform.OS === 'android') {
    validateIssuerOrServiceConfigurationEndpoints(issuer, serviceConfiguration);
    validateClientId(clientId);
    validateRedirectUrl(redirectUrl);
    validateHeaders(customHeaders);

    const nativeMethodArguments = [
      warmAndPrefetchChrome,
      issuer,
      redirectUrl,
      clientId,
      scopes,
      serviceConfiguration,
      dangerouslyAllowInsecureHttpRequests,
      customHeaders,
    ];

    RNAppAuth.prefetchConfiguration(...nativeMethodArguments);
  }
};
