import { createContext } from "react";

export type LineGeometry = [number, number][];

export type EventItem = {
  id: string;
  work: string;
  geoms: string[];
};

export interface MapDataContextValue {
  lines: LineGeometry[];
  events: EventItem[];
  setLines: (lines: LineGeometry[]) => void;
  setEvents: (events: EventItem[]) => void;
}

export const MapDataContext = createContext<MapDataContextValue | null>(null);