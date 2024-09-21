/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext } from "react";
import EventEmitter from "eventemitter3";

export type GlobalEmitterType = EventEmitter<string, any>;

const GlobalEventEmitterContext = createContext<GlobalEmitterType | undefined>(
  undefined
);

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalEventEmitter = (): GlobalEmitterType => {
  const globalEmitter = useContext(GlobalEventEmitterContext);
  if (!globalEmitter) {
    throw new Error(
      "useGlobalEventEmitter must be used within a GlobalEventEmitterProvider"
    );
  }
  return globalEmitter;
};

interface GlobalEventEmitterProviderProps {
  children: React.ReactNode;
}

export const GlobalEventEmitterProvider: React.FC<
  GlobalEventEmitterProviderProps
> = ({ children }) => {
  const globalEmitter = new EventEmitter<string, any>();

  return (
    <GlobalEventEmitterContext.Provider value={globalEmitter}>
      {children}
    </GlobalEventEmitterContext.Provider>
  );
};
