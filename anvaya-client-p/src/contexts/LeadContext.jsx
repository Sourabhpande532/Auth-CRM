import { createContext, useContext } from "react";

const LeadContext = createContext();

const LeadProvider = ({ children }) => {
  return <LeadContext.Provider>{children}</LeadContext.Provider>;
};
const useLead = () => useContext(LeadContext);
export { LeadProvider, LeadContext, useLead };
