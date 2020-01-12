import React, { useState, useCallback } from 'react';
import { UIManager, LayoutAnimation, Alert } from 'react-native';
import { authorize, refresh, revoke, onlyAuthorize, onlyTokenExchange } from 'react-native-app-auth';
import { Page, Button, ButtonContainer, Form, FormLabel, FormValue, Heading } from './components';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

type State = {
  hasLoggedInOnce: boolean,
  accessToken: ?string,
  accessTokenExpirationDate: ?string,
  refreshToken: ?string
};

const config = {
  issuer: 'https://demo.identityserver.io',
  clientId: 'native.code',
  redirectUrl: 'io.identityserver.demo:/oauthredirect',
  additionalParameters: {},
  scopes: ['openid', 'profile', 'email', 'offline_access'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://demo.identityserver.io/connect/authorize',
    tokenEndpoint: 'https://demo.identityserver.io/connect/token',
    revocationEndpoint: 'https://demo.identityserver.io/connect/revoke'
  }
};

const defaultAuthState = {
  hasLoggedInOnce: false,
  accessToken: '',
  accessTokenExpirationDate: '',
  refreshToken: ''
};

export default () => {
  const [authState, setAuthState] = useState(defaultAuthState);

  const handleAuthorize = useCallback(async () => {
    try {
      const newAuthState = await authorize(config);

      setAuthState({
        hasLoggedInOnce: true,
        ...newAuthState
      });

    } catch (error) {
      Alert.alert('Failed to log in', error.message);
    }
  }, [authState]);

  const handleOnlyAuthorize = useCallback(async () => {
    try {
      const newAuthState = await onlyAuthorize(config);

      console.log(newAuthState);
    } catch (error) {
      Alert.alert('Failed to log in', error.message);
    }
  }, [authState]);

  const handleOnlyTokenExchange = useCallback(async () => {
    try {
      const newAuthState = await onlyTokenExchange();

      console.log(newAuthState);
    } catch (error) {
      Alert.alert('Failed to log in', error.message);
    }
  }, [authState]);

  const handleRefresh = useCallback(async () => {
    try {
      const newAuthState = await refresh(config, {
        refreshToken: authState.refreshToken
      });

      setAuthState(current => ({
        ...current,
        ...newAuthState
      }))

    } catch (error) {
      Alert.alert('Failed to refresh token', error.message);
    }
  }, [authState]);

  const handleRevoke = useCallback(async () => {
    try {
      await revoke(config, {
        tokenToRevoke: authState.accessToken,
        sendClientId: true
      });

      setAuthState({
        accessToken: '',
        accessTokenExpirationDate: '',
        refreshToken: ''
      });
    } catch (error) {
      Alert.alert('Failed to revoke token', error.message);
    }
  }, [authState]);

  return (
    <Page>
      {!!authState.accessToken ? (
        <Form>
          <FormLabel>accessToken</FormLabel>
          <FormValue>{authState.accessToken}</FormValue>
          <FormLabel>accessTokenExpirationDate</FormLabel>
          <FormValue>{authState.accessTokenExpirationDate}</FormValue>
          <FormLabel>refreshToken</FormLabel>
          <FormValue>{authState.refreshToken}</FormValue>
          <FormLabel>scopes</FormLabel>
          <FormValue>{authState.scopes.join(', ')}</FormValue>
        </Form>
      ) : (
        <Heading>{authState.hasLoggedInOnce ? 'Goodbye.' : 'Hello, stranger.'}</Heading>
      )}

      <ButtonContainer>
        <Button onPress={this.onlyAuthorize} text="Only Authorize" color="#00b300" />
        <Button onPress={this.onlyTokenExchange} text="Only Token Exchange" color="#FFA500" />
        {!authState.accessToken ? (
          <Button onPress={handleAuthorize} text="Authorize" color="#DA2536" />
        ) : null}
        {!!authState.refreshToken ? (
          <Button onPress={handleRefresh} text="Refresh" color="#24C2CB" />
        ) : null}
        {!!authState.accessToken ? (
          <Button onPress={handleRevoke} text="Revoke" color="#EF525B" />
        ) : null}
      </ButtonContainer>
    </Page>
  );
}
