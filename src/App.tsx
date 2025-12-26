import './App.css'
import InfoPanel from './components/InfoPanel.tsx';
import { MapDataProvider } from "./map/MapDataProvider";
import GoogleSheetData from "./components/GoogleSheetData";
import Map2GIS from "./components/Map2GIS";

function App() {
  return (
    <>
      <InfoPanel />
      <MapDataProvider>
        <GoogleSheetData />
        <Map2GIS />
      </MapDataProvider>
    </>
  );
}

export default App;
