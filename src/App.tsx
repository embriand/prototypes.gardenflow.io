import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import EnhancedParcelZoneCrops from './prototypes/enhanced-parcel-zone-crops'
import DynamicSearchBar from './prototypes/dynamic-search-bar'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enhanced-parcel-zone-crops" element={<EnhancedParcelZoneCrops />} />
          <Route path="/dynamic-search-bar" element={<DynamicSearchBar />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App