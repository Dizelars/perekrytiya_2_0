import { useState } from "react";
import { MapDataContext } from "./MapDataContext";
import type { EventItem, LineGeometry } from "./MapDataContext";

export const MapDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lines, setLines] = useState<LineGeometry[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  // Режим редактирования линий
  const [editMode, setEditMode] = useState<boolean>(false);

  return (
    <MapDataContext.Provider
      value={{
        lines,
        setLines,
        events,
        setEvents,
        editMode,
        setEditMode,
      }}
    >
      {children}
    </MapDataContext.Provider>
  );
};
