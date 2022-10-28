import React, { useContext, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

//user status tells if the user is logged in or not
const UserStatusContext = React.createContext();
export function getUserStatus() {
  return useContext(UserStatusContext);
}

const UserTokenContext = React.createContext();
export function getUserToken() {
  return useContext(UserTokenContext);
}
const TOKEN = "token";
export function UserStatusProvider({ children }) {
  const [isSignedInState, setIsSignedInState] = useState(false);
  const [driverModeState, setDriverModeState] = useState(false);
  const [registeredAsDriverState, setRegisteredAsDriverState] = useState(false);

  async function deleteKey(key) {
    await SecureStore.deleteItemAsync(key);
  }
  
  async function saveKey(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  async function getValueFor(key) {
    return await SecureStore.getItemAsync(key);
  }

  //FIXME: maybe delete alert when token cant be deleted
  return (
    <UserStatusContext.Provider
      value={{
        signInState: {
          value: isSignedInState,
          signIn: function () {
            setIsSignedInState(true);
            return;
          },
          signOut: function () {
            deleteKey(TOKEN).catch((e) => {console.log(e); Alert.alert("There was an error deleting the token")})
            setRegisteredAsDriverState(false);
            setDriverModeState(false);
            setIsSignedInState(false);
            return;
          },
        },

        driverMode: {
          value: driverModeState,
          enter: function() {
            setDriverModeState(true);
            return;
          },
          exit: function () {
            setDriverModeState(false);
            return;
          },
        },

        registeredAsDriver: {
          value: registeredAsDriverState,
          setIsRegistered: function() {
            setRegisteredAsDriverState(true);
            return;
          },
          setIsNotRegistered: function () {
            setRegisteredAsDriverState(false);
            return;
          },
        },
        
      }}
    >
      <UserTokenContext.Provider
        value={{
          value: async function () {
            return getValueFor(TOKEN);
          },
          set: function (value) {
            console.log("Saving token: " + value);
            saveKey(TOKEN, value);
            return;
          },
        }}
      >
        {children}
      </UserTokenContext.Provider>
    </UserStatusContext.Provider>
  );
}
