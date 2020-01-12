import { Platform, NativeModules } from 'react-native';

import {
  validateClientId,
  validateIssuerOrServiceConfigurationEndpoints,
  validateRedirectUrl,
  validateHeaders,
} from './validators';

const { RNAppAuth } = NativeModules;

export default ({
  issuer,
  redirectUrl,
  clientId,
  clientSecret,
  scopes,
  useNonce = true,
  usePKCE = true,
  additionalParameters,
  serviceConfiguration,
  clientAuthMethod = 'basic',
  dangerouslyAllowInsecureHttpRequests = false,
  customHeaders,
}) => {
  validateIssuerOrServiceConfigurationEndpoints(issuer, serviceConfiguration);
  validateClientId(clientId);
  validateRedirectUrl(redirectUrl);
  validateHeaders(customHeaders);
  // TODO: validateAdditionalParameters

  const nativeMethodArguments = [
    issuer,
    redirectUrl,
    clientId,
    clientSecret,
    scopes,
    additionalParameters,
    serviceConfiguration,
  ];

  if (Platform.OS === 'android') {
    nativeMethodArguments.push(usePKCE);
    nativeMethodArguments.push(clientAuthMethod);
    nativeMethodArguments.push(dangerouslyAllowInsecureHttpRequests);
    nativeMethodArguments.push(customHeaders);
  }

  if (Platform.OS === 'ios') {
    nativeMethodArguments.push(useNonce);
    nativeMethodArguments.push(usePKCE);
  }

  return RNAppAuth.onlyAuthorize(...nativeMethodArguments);
};
