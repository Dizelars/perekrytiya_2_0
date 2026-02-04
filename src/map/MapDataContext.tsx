import { createContext } from "react";

export type LineGeometry = { id: string; geom: [number, number][]; };

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

  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MapDataContext = createContext<MapDataContextValue | null>(null);