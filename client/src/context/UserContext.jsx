import { createContext, useContext, useState } from "react";

// create context
const UserContext = createContext();

// hook
export const useUser = () => useContext(UserContext);

// provider
export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (name) => {
    setUsername(name);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUsername("");
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider
      value={{
        username,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
