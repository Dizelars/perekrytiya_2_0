import './App.css'
import { useState } from "react";
import InfoPanel from './components/InfoPanel.tsx';
import { MapDataProvider } from "./map/MapDataProvider";
import GoogleSheetData from "./components/GoogleSheetData";
import Map2GIS from "./components/Map2GIS";
import DraggableElement from "./components/DraggableElement";
import ScreenShot from "./components/ScreenShot";

const getToday = (): string => new Date().toISOString().slice(0, 10);

function App() {
  const [selectedDate, setSelectedDate] = useState<string>(getToday);

  return (
    <>
      <MapDataProvider>
        <InfoPanel
          today={selectedDate}
          onDateChange={setSelectedDate} 
        />
        <GoogleSheetData selectedDate={selectedDate} />
        <Map2GIS />
        <DraggableElement initialPosition={{ x: 50, y: 100 }}>
          <ScreenShot />
        </DraggableElement>
      </MapDataProvider>
    </>
  );
}

export default App;
