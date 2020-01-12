import invariant from 'invariant';
import { Platform, NativeModules } from 'react-native';

import {
  validateIssuerOrServiceConfigurationRegistrationEndpoint,
  validateHeaders,
} from './validators';

const { RNAppAuth } = NativeModules;

export default ({
  issuer,
  redirectUrls,
  responseTypes,
  grantTypes,
  subjectType,
  tokenEndpointAuthMethod,
  additionalParameters,
  serviceConfiguration,
  dangerouslyAllowInsecureHttpRequests = false,
  customHeaders,
}) => {
  validateIssuerOrServiceConfigurationRegistrationEndpoint(issuer, serviceConfiguration);
  validateHeaders(customHeaders);
  invariant(
    Array.isArray(redirectUrls) && redirectUrls.every(url => typeof url === 'string'),
    'Config error: redirectUrls must be an Array of strings'
  );
  invariant(
    responseTypes == null ||
      (Array.isArray(responseTypes) && responseTypes.every(rt => typeof rt === 'string')),
    'Config error: if provided, responseTypes must be an Array of strings'
  );
  invariant(
    grantTypes == null ||
      (Array.isArray(grantTypes) && grantTypes.every(gt => typeof gt === 'string')),
    'Config error: if provided, grantTypes must be an Array of strings'
  );
  invariant(
    subjectType == null || typeof subjectType === 'string',
    'Config error: if provided, subjectType must be a string'
  );
  invariant(
    tokenEndpointAuthMethod == null || typeof tokenEndpointAuthMethod === 'string',
    'Config error: if provided, tokenEndpointAuthMethod must be a string'
  );

  const nativeMethodArguments = [
    issuer,
    redirectUrls,
    responseTypes,
    grantTypes,
    subjectType,
    tokenEndpointAuthMethod,
    additionalParameters,
    serviceConfiguration,
  ];

  if (Platform.OS === 'android') {
    nativeMethodArguments.push(dangerouslyAllowInsecureHttpRequests);
    nativeMethodArguments.push(customHeaders);
  }

  return RNAppAuth.register(...nativeMethodArguments);
};
