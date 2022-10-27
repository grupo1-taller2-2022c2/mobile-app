import React, { useContext, useState } from "react";
import * as SecureStore from "expo-secure-store";

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

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  async function getValueFor(key) {
    return await SecureStore.getItemAsync(key);
  }

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
      }}
    >
      <UserTokenContext.Provider
        value={{
          value: async function () {
            return getValueFor(TOKEN);
          },
          set: function (value) {
            console.log("Saving token: " + value);
            save(TOKEN, value);
            return;
          },
        }}
      >
        {children}
      </UserTokenContext.Provider>
    </UserStatusContext.Provider>
  );
}
