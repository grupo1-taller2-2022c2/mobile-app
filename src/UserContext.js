import React, { useContext, useState } from "react";
import * as SecureStore from 'expo-secure-store';

//user status tells if the user is logged in or not
const UserStatusContext = React.createContext();
export function userStatus() {
  return useContext(UserStatusContext);
}

const UserTokenContext = React.createContext();
export function userToken() {
  return useContext(UserTokenContext);
}
const TOKEN = "token";
export function UserStatusProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  
  async function getValueFor(key) {
    return await SecureStore.getItemAsync(key);
  }

  return (
    <UserStatusContext.Provider
      value={{
        value: isSignedIn,
        set: function (value) {
          setIsSignedIn(value);
          return;
        },
      }}
    >
      <UserTokenContext.Provider
        value={{
          value: async function () {
            return getValueFor(TOKEN)
          },
          set: function (value) {
            console.log("Saving token: " + value)
            save(TOKEN,value);
            return;
          },
        }}
      >
        {children}
      </UserTokenContext.Provider>
    </UserStatusContext.Provider>
  );
}
