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

export function UserStatusProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [token, setToken] = useState("");

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  
  async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      console.log("returned value is " + result);
      setToken(result)
    } else {
      console.log('No values stored under that key.');
      return "";
    }
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
          value: function () {
            getValueFor("token")
            console.log("Using token: " + token)
            return token
          },
          set: function (value) {
            console.log("Saving token: " + value)
            save("token",value);
            return;
          },
        }}
      >
        {children}
      </UserTokenContext.Provider>
    </UserStatusContext.Provider>
  );
}
