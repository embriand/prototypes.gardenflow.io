import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import LoadingFallback from './components/LoadingFallback'

// Lazy load all prototype components
const EnhancedParcelZoneCrops = lazy(() => import('./prototypes/enhanced-parcel-zone-crops'))
const DynamicSearchBar = lazy(() => import('./prototypes/dynamic-search-bar'))
const CanvasViewer = lazy(() => import('./prototypes/canvas-viewer'))
const Donations = lazy(() => import('./prototypes/donations'))
const Calendar = lazy(() => import('./prototypes/calendar'))
const CollapsableDrawers = lazy(() => import('./prototypes/collapsable-drawers'))
const MessagingChat = lazy(() => import('./prototypes/messaging-chat'))
const Chat = lazy(() => import('./prototypes/chat'))
const GuideTour = lazy(() => import('./prototypes/guidetour'))
const ApiConfig = lazy(() => import('./prototypes/apiconfig'))
const ApiProductsPartners = lazy(() => import('./prototypes/api-products-partners'))
const Landscape = lazy(() => import('./prototypes/landscape'))
const ClientTasksManagement = lazy(() => import('./prototypes/client-tasks-management'))
const ActivityManagementSystem = lazy(() => import('./prototypes/activity-management-system'))
const CompostManagement = lazy(() => import('./prototypes/compost'))
const PollinationDashboard = lazy(() => import('./prototypes/pollination'))
const GardenVision = lazy(() => import('./prototypes/garden-vision'))
const GardenPlanner = lazy(() => import('./prototypes/ai-garden-planner/GardenPlanner'))
const MobileCalendarEvents = lazy(() => import('./prototypes/mobile-calendar-events'))
const MobileLanding = lazy(() => import('./prototypes/mobile-landing'))
const MobileMapGarden = lazy(() => import('./prototypes/mobile-map-garden'))
const MobileClientTask = lazy(() => import('./prototypes/mobile-client-task'))
const Companion = lazy(() => import('./prototypes/companion'))
const LoginComponent = lazy(() => import('./prototypes/login-component'))
const TemplateParcelZone = lazy(() => import('./prototypes/template-parcel-zone'))
const GoodPalChat = lazy(() => import('./prototypes/goodpal-chat'))

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/enhanced-parcel-zone-crops" element={
              <Suspense fallback={<LoadingFallback message="Loading Enhanced Parcel Zone Crops..." />}>
                <EnhancedParcelZoneCrops />
              </Suspense>
            } />
            <Route path="/dynamic-search-bar" element={
              <Suspense fallback={<LoadingFallback message="Loading Dynamic Search Bar..." />}>
                <DynamicSearchBar />
              </Suspense>
            } />
            <Route path="/canvas-viewer" element={
              <Suspense fallback={<LoadingFallback message="Loading Canvas Viewer..." />}>
                <CanvasViewer />
              </Suspense>
            } />
            <Route path="/donations" element={
              <Suspense fallback={<LoadingFallback message="Loading Donations..." />}>
                <Donations />
              </Suspense>
            } />
            <Route path="/calendar" element={
              <Suspense fallback={<LoadingFallback message="Loading Calendar..." />}>
                <Calendar />
              </Suspense>
            } />
            <Route path="/collapsable-drawers" element={
              <Suspense fallback={<LoadingFallback message="Loading Collapsable Drawers..." />}>
                <CollapsableDrawers />
              </Suspense>
            } />
            <Route path="/messaging-chat" element={
              <Suspense fallback={<LoadingFallback message="Loading Messaging Chat..." />}>
                <MessagingChat />
              </Suspense>
            } />
            <Route path="/chat" element={
              <Suspense fallback={<LoadingFallback message="Loading Chat Component..." />}>
                <Chat />
              </Suspense>
            } />
            <Route path="/guidetour" element={
              <Suspense fallback={<LoadingFallback message="Loading Guide Tour..." />}>
                <GuideTour />
              </Suspense>
            } />
            <Route path="/apiconfig" element={
              <Suspense fallback={<LoadingFallback message="Loading API Configuration..." />}>
                <ApiConfig />
              </Suspense>
            } />
            <Route path="/api-products-partners" element={
              <Suspense fallback={<LoadingFallback message="Loading API Products & Partners..." />}>
                <ApiProductsPartners />
              </Suspense>
            } />
            <Route path="/landscape" element={
              <Suspense fallback={<LoadingFallback message="Loading Landscape Designer..." />}>
                <Landscape />
              </Suspense>
            } />
            <Route path="/clientTasksManagement" element={
              <Suspense fallback={<LoadingFallback message="Loading Client Tasks Management..." />}>
                <ClientTasksManagement />
              </Suspense>
            } />
            <Route path="/activityManagementSystem" element={
              <Suspense fallback={<LoadingFallback message="Loading Activity Management System..." />}>
                <ActivityManagementSystem />
              </Suspense>
            } />
            <Route path="/compostManagement" element={
              <Suspense fallback={<LoadingFallback message="Loading Compost Management..." />}>
                <CompostManagement />
              </Suspense>
            } />
            <Route path="/pollinationDashboardContainer" element={
              <Suspense fallback={<LoadingFallback message="Loading Pollination Dashboard..." />}>
                <PollinationDashboard />
              </Suspense>
            } />
            <Route path="/gardenVision" element={
              <Suspense fallback={<LoadingFallback message="Loading Garden Vision..." />}>
                <GardenVision />
              </Suspense>
            } />
            <Route path="/aiGardenPlanner" element={
              <Suspense fallback={<LoadingFallback message="Loading AI Garden Planner..." />}>
                <GardenPlanner />
              </Suspense>
            } />
            <Route path="/mobile-calendar-events" element={
              <Suspense fallback={<LoadingFallback message="Loading Mobile Calendar Events..." />}>
                <MobileCalendarEvents />
              </Suspense>
            } />
            <Route path="/mobile-landing" element={
              <Suspense fallback={<LoadingFallback message="Loading Mobile Landing..." />}>
                <MobileLanding />
              </Suspense>
            } />
            <Route path="/mobile-map-garden" element={
              <Suspense fallback={<LoadingFallback message="Loading Mobile Map Garden..." />}>
                <MobileMapGarden />
              </Suspense>
            } />
            <Route path="/mobile-client-task" element={
              <Suspense fallback={<LoadingFallback message="Loading Mobile Client Task..." />}>
                <MobileClientTask />
              </Suspense>
            } />
            <Route path="/companion" element={
              <Suspense fallback={<LoadingFallback message="Loading Plant Companion Manager..." />}>
                <Companion />
              </Suspense>
            } />
            <Route path="/login-component" element={
              <Suspense fallback={<LoadingFallback message="Loading Login Component..." />}>
                <LoginComponent />
              </Suspense>
            } />
            <Route path="/template-parcel-zone" element={
              <Suspense fallback={<LoadingFallback message="Loading Template Parcel Zone..." />}>
                <TemplateParcelZone />
              </Suspense>
            } />
            <Route path="/goodpal-chat" element={
              <Suspense fallback={<LoadingFallback message="Loading GoodPal Chat..." />}>
                <GoodPalChat />
              </Suspense>
            } />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  )
}

export default App