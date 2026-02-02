import "./App.css";
import { useState } from "react";
import InfoPanel from "./components/InfoPanel/InfoPanel.tsx";
import { MapDataProvider } from "./map/MapDataProvider";
import GoogleSheetData from "./components/GoogleSheetData";
import Map2GIS from "./components/Map2GIS/Map2GIS";

const getToday = (): string => new Date().toISOString().slice(0, 10);

function App() {
  const [selectedDate, setSelectedDate] = useState<string>(getToday);

  return (
    <>
      <MapDataProvider>
        <InfoPanel today={selectedDate} onDateChange={setSelectedDate} />
        <GoogleSheetData selectedDate={selectedDate} />
        <Map2GIS />
      </MapDataProvider>
    </>
  );
}

export default App;
