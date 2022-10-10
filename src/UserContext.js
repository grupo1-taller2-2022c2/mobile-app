import React, { useContext, useState } from "react";

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
          value: token,
          set: function (value) {
            setToken(value);
            return;
          },
        }}
      >
        {children}
      </UserTokenContext.Provider>
    </UserStatusContext.Provider>
  );
}
