import React, { useContext, useState } from "react";

//user status tells if the user is logged in or not
const MapContext = React.createContext();
export function mapContext() {
  return useContext(MapContext);
}

export function MapContextProvider({ children }) {
  const [destinationInput, onChangeDestinationInput] = useState(null);
  const [location, setLocation] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [tripModalVisible, setTripModalVisible] = useState(false);

  return (
    <MapContext.Provider
      value={{
        values: {
          destinationInput,
          location,
          destinationCoords,
          tripModalVisible,
        },
        setters: {
          onChangeDestinationInput,
          setLocation,
          setDestinationCoords,
          setTripModalVisible,
        },
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
