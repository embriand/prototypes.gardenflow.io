import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Layers, ArrowLeft } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  const isHome = location.pathname === '/'
  
  // Full-page prototypes that should not show the Layout header/footer
  const fullPagePrototypes = [
    '/landing-page-noauth'
  ]
  const isFullPage = fullPagePrototypes.includes(location.pathname)

  // If it's a full-page prototype, render children directly
  if (isFullPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isHome && (
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Home</span>
                </Link>
              )}
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">GardenFlow Prototypes</h1>
                  <p className="text-sm text-slate-600">Development & Testing Environment</p>
                </div>
              </div>
            </div>
            
            <nav className="flex items-center space-x-4">
              <Link 
                to="/" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isHome 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 border-t border-slate-200/50 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-center text-sm text-slate-500">
            <p>GardenFlow Prototypes Management • Port 5174</p>
            <p className="mt-1">Isolated environment for testing and development</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout