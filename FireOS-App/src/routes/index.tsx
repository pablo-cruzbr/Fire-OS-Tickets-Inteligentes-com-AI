import React, { useContext } from 'react';

import {View, ActivityIndicator} from 'react-native';

import AppRoutes from './appRoutes';
import AuthRoutes from './authroutes';
import { AuthContext } from "../contexts/AuthContext";
import { useTheme } from "../theme";

function Routes(){
const {isAuthenticated} = useContext(AuthContext)
const { colors } = useTheme();
const loading = false;
 if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={60} color={colors.primary} />
      </View>
    );
  }

return(
    isAuthenticated ? <AppRoutes/> : <AuthRoutes/>
)
}

export default Routes;
