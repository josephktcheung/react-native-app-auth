package com.rnappauth.utils;

import android.text.TextUtils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import net.openid.appauth.AuthorizationResponse;
import net.openid.appauth.TokenResponse;

public final class ResponseFactory {

    private static final WritableArray createScopeArray(String scope) {
        WritableArray scopeArray = Arguments.createArray();
        if (!TextUtils.isEmpty(scope)) {
            String[] scopesArray = scope.split(" ");

            for( int i = 0; i < scopesArray.length - 1; i++)
            {
                scopeArray.pushString(scopesArray[i]);
            }
        }

        return scopeArray;
    }


    /*
     * Read raw token response into a React Native map to be passed down the bridge
     */
    public static final WritableMap tokenResponseToMap(TokenResponse response) {
        WritableMap map = Arguments.createMap();

        map.putString("accessToken", response.accessToken);
        map.putMap("additionalParameters", MapUtil.createAdditionalParametersMap(response.additionalParameters));
        map.putString("idToken", response.idToken);
        map.putString("refreshToken", response.refreshToken);
        map.putString("tokenType", response.tokenType);

        if (response.accessTokenExpirationTime != null) {
            map.putString("accessTokenExpirationTime", DateUtil.formatTimestamp(response.accessTokenExpirationTime));
        }

        return map;
    }

    /*
     * Read raw token response into a React Native map to be passed down the bridge
     */
    public static final WritableMap authorizationResponseToMap(AuthorizationResponse response) {
        WritableMap map = Arguments.createMap();

        map.putMap("additionalParameters", createAdditionalParametersMap(response.additionalParameters));
        map.putArray("scopes", createScopeArray(response.scope));
        map.putString("authorizationCode", response.authorizationCode);
        map.putString("state", response.state);

        return map;
    }
}
