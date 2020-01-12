import invariant from 'invariant';
import base64 from 'react-native-base64';

import {
  validateClientId,
  validateIssuerOrServiceConfigurationRevocationEndpoint,
} from './validators';

export default async (
  { clientId, issuer, serviceConfiguration, clientSecret },
  { tokenToRevoke, sendClientId = false, includeBasicAuth = false }
) => {
  invariant(tokenToRevoke, 'Please include the token to revoke');
  validateClientId(clientId);
  validateIssuerOrServiceConfigurationRevocationEndpoint(issuer, serviceConfiguration);

  let revocationEndpoint;
  if (serviceConfiguration && serviceConfiguration.revocationEndpoint) {
    revocationEndpoint = serviceConfiguration.revocationEndpoint;
  } else {
    const response = await fetch(`${issuer}/.well-known/openid-configuration`);
    const openidConfig = await response.json();

    invariant(
      openidConfig.revocation_endpoint,
      'The openid config does not specify a revocation endpoint'
    );

    revocationEndpoint = openidConfig.revocation_endpoint;
  }

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  if (includeBasicAuth) {
    headers.Authorization = `Basic ${base64.encode(`${clientId}:${clientSecret}`)}`;
  }
  /**
    Identity Server insists on client_id being passed in the body,
    but Google does not. According to the spec, Google is right
    so defaulting to no client_id
    https://tools.ietf.org/html/rfc7009#section-2.1
  **/
  return await fetch(revocationEndpoint, {
    method: 'POST',
    headers,
    body: `token=${tokenToRevoke}${sendClientId ? `&client_id=${clientId}` : ''}`,
  }).catch(error => {
    throw new Error('Failed to revoke token', error);
  });
};
