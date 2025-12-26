import { useContext } from "react";
import { MapDataContext } from "./MapDataContext";

export function useMapData() {
  const context = useContext(MapDataContext);

  if (!context) {
    throw new Error("useMapData must be used within MapDataProvider");
  }

  return context;
}
