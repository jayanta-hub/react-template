import React, { createContext, useContext, useState } from "react";
import { ROUTES } from "../constant";

interface LastVisitedContextType {
  lastVisited: string;
  setLastVisited: (path: string) => void;
}

const LastVisitedContext = createContext<LastVisitedContextType>({
  lastVisited: "/",
  setLastVisited: () => { },
});

export const LastVisitedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastVisited, setLastVisitedState] = useState<string>(() => {
    const isNewTemplate = localStorage.getItem("templateValue");
    return sessionStorage.getItem("lastVisited") || `${ROUTES.DASHBOARD}?theme=${isNewTemplate}`;
  });

  const setLastVisited = (path: string) => {
    setLastVisitedState(path);
    sessionStorage.setItem("lastVisited", path);
  };

  return (
    <LastVisitedContext.Provider value={{ lastVisited, setLastVisited }}>
      {children}
    </LastVisitedContext.Provider>
  );
};

export const useLastVisited = () => useContext(LastVisitedContext);
