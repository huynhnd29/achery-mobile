import React, { createContext, useContext, useState } from "react";

const EventContext = createContext<any>(null);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [eventName, setEventName] = useState<string>("");

  return (
    <EventContext.Provider value={{ eventName, setEventName }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => useContext(EventContext);
