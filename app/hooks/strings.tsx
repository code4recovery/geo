import { createContext, PropsWithChildren, useContext } from "react";

export const strings = {
  appTitle: "Geo",
  appDescription: "Find and verify meeting locations.",
  searchPlaceholder: "Enter an address",
};

const StringsContext = createContext<typeof strings>(strings);

export const StringsProvider = ({ children }: PropsWithChildren) => (
  <StringsContext.Provider value={strings}>{children}</StringsContext.Provider>
);

export const useStrings = () => useContext(StringsContext);
