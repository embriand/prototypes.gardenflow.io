import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import EnhancedParcelZoneCrops from './prototypes/enhanced-parcel-zone-crops'
import DynamicSearchBar from './prototypes/dynamic-search-bar'
import CanvasViewer from './prototypes/canvas-viewer'
import Donations from './prototypes/donations'
import Calendar from './prototypes/calendar'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enhanced-parcel-zone-crops" element={<EnhancedParcelZoneCrops />} />
          <Route path="/dynamic-search-bar" element={<DynamicSearchBar />} />
          <Route path="/canvas-viewer" element={<CanvasViewer />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App