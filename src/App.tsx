import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import EnhancedParcelZoneCrops from './prototypes/enhanced-parcel-zone-crops'
import DynamicSearchBar from './prototypes/dynamic-search-bar'
import CanvasViewer from './prototypes/canvas-viewer'
import Donations from './prototypes/donations'
import Calendar from './prototypes/calendar'
import CollapsableDrawers from './prototypes/collapsable-drawers'
import MessagingChat from './prototypes/messaging-chat'
import Chat from './prototypes/chat'
import GuideTour from './prototypes/guidetour'
import ApiConfig from './prototypes/apiconfig'
import Landscape from './prototypes/landscape'
import ClientTasksManagement from './prototypes/client-tasks-management'
import ActivityManagementSystem from './prototypes/activity-management-system'
import CompostManagement from './prototypes/compost'
import PollinationDashboard from './prototypes/pollination'
import GardenVision from './prototypes/garden-vision'
import GardenPlanner from './prototypes/ai-garden-planner/GardenPlanner'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enhanced-parcel-zone-crops" element={<EnhancedParcelZoneCrops />} />
          <Route path="/dynamic-search-bar" element={<DynamicSearchBar />} />
          <Route path="/canvas-viewer" element={<CanvasViewer />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/collapsable-drawers" element={<CollapsableDrawers />} />
          <Route path="/messaging-chat" element={<MessagingChat />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/guidetour" element={<GuideTour />} />
          <Route path="/apiconfig" element={<ApiConfig />} />
          <Route path="/landscape" element={<Landscape />} />
          <Route path="/clientTasksManagement" element={<ClientTasksManagement />} />
          <Route path="/activityManagementSystem" element={<ActivityManagementSystem />} />
          <Route path="/compostManagement" element={<CompostManagement />} />
          <Route path="/pollinationDashboardContainer" element={<PollinationDashboard />} />
          <Route path="/gardenVision" element={<GardenVision />} />
          <Route path="/aiGardenPlanner" element={<GardenPlanner />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App