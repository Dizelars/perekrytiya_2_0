import './App.css'
import Map2GIS from './components/Map2GIS.tsx';

function App() {
  return (
    <>
      <h1 style={{position: 'absolute', top: '20px', left: '20px', zIndex: 1, margin: 0 }}>Перекрытия 2.0</h1>
      <Map2GIS />
    </>
  )
}

export default App
