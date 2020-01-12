import { Platform, NativeModules } from 'react-native';

const { RNAppAuth } = NativeModules;

export default ({
  clientSecret,
  additionalParameters,
  dangerouslyAllowInsecureHttpRequests = false,
  customHeaders,
}) => {
  const nativeMethodArguments = [clientSecret];
  if (Platform.OS === 'android') {
    nativeMethodArguments.push(dangerouslyAllowInsecureHttpRequests);
    nativeMethodArguments.push(customHeaders);
  }

  return RNAppAuth.onlyTokenExchange(
    clientSecret,
    additionalParameters,
    dangerouslyAllowInsecureHttpRequests,
    customHeaders
  );
};
