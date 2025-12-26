import { createContext } from "react";

export type LineGeometry = [number, number][];

export interface MapDataContextValue {
  lines: LineGeometry[];
  setLines: (lines: LineGeometry[]) => void;
}

export const MapDataContext = createContext<MapDataContextValue | null>(null);
