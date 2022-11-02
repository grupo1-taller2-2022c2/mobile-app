import React, { useContext, useState } from "react";

//user status tells if the user is logged in or not
const MapContext = React.createContext();
export function mapContext() {
  return useContext(MapContext);
}

export function MapContextProvider({ children }) {
  const [destinationInput, onChangeDestinationInput] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [destinationAddress, setDestinationAddress] = useState(null);
  const [tripModalVisible, setTripModalVisible] = useState(false);
  const [estimatedTripPrice, setEstimatedTripPrice] = useState(0);
  const [tripID, setTripID] = useState(null)

  return (
    <MapContext.Provider
      value={{
        values: {
          destinationInput,
          userLocation,
          userAddress,
          destinationCoords,
          destinationAddress,
          tripModalVisible,
          estimatedTripPrice,
          tripID
        },
        setters: {
          onChangeDestinationInput,
          setUserLocation,
          setUserAddress,
          setDestinationCoords,
          setDestinationAddress,
          setTripModalVisible,
          setEstimatedTripPrice,
          setTripID
        },
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
