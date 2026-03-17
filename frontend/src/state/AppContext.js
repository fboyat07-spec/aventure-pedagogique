import React, { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [child, setChild] = useState(null);
  const [token, setToken] = useState(null);

  return (
    <AppContext.Provider value={{ user, setUser, child, setChild, token, setToken }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
