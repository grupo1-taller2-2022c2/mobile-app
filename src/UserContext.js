import React, { useContext, useState } from "react";

const UserContext = React.createContext();
const UserUpdateContext = React.createContext();

export function userStatus() {
  return useContext(UserContext);
}

export function userStatusUpdate(){
    return useContext(UserUpdateContext);
}

export function UserStatusProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <UserContext.Provider value={isSignedIn}>
      <UserUpdateContext.Provider value={setIsSignedIn}>
        {children}
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  );
}
