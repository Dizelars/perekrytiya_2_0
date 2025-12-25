import './App.css'
import Map2GIS from './components/Map2GIS.tsx';
import InfoPanel from './components/InfoPanel.tsx';
import { GoogleSheetData } from './components/GoogleSheetData.tsx';

function App() {
  return (
    <>
      <InfoPanel />
      <GoogleSheetData />
      <Map2GIS />
    </>
  )
}

export default App