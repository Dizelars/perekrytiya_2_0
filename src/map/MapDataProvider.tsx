import { useState } from "react";
import { MapDataContext } from "./MapDataContext";
import type { LineGeometry } from "./MapDataContext";

export const MapDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lines, setLines] = useState<LineGeometry[]>([]);

  return (
    <MapDataContext.Provider value={{ lines, setLines }}>
      {children}
    </MapDataContext.Provider>
  );
};
