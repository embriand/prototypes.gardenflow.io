import React from 'react';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  deviceType?: 'iphone' | 'android';
  showNotch?: boolean;
}

const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ 
  children, 
  deviceType = 'iphone',
  showNotch = true 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 flex items-center justify-center p-4">
      {/* Mobile Device Frame */}
      <div className="relative">
        {/* Device Shadow */}
        <div className="absolute inset-0 bg-black/20 rounded-[3rem] blur-2xl transform translate-y-4 scale-105"></div>
        
        {/* Device Frame */}
        <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl">
          {/* Screen Container */}
          <div className="bg-white rounded-[2.5rem] overflow-hidden relative">
            {/* Notch (iPhone style) */}
            {showNotch && deviceType === 'iphone' && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-black rounded-b-2xl px-6 py-1">
                  <div className="w-16 h-1 bg-gray-800 rounded-full mx-auto"></div>
                </div>
              </div>
            )}
            
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 z-40 bg-white">
              <div className="flex justify-between items-center px-6 py-2 text-black text-sm font-medium">
                <div className="flex items-center space-x-1">
                  <span>9:41</span>
                </div>
                <div className="flex items-center space-x-1">
                  {/* Signal Bars */}
                  <div className="flex space-x-0.5">
                    <div className="w-1 h-2 bg-black rounded-full"></div>
                    <div className="w-1 h-3 bg-black rounded-full"></div>
                    <div className="w-1 h-4 bg-black rounded-full"></div>
                    <div className="w-1 h-3 bg-gray-300 rounded-full"></div>
                  </div>
                  {/* WiFi */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                  </svg>
                  {/* Battery */}
                  <div className="flex items-center">
                    <div className="w-6 h-3 border border-black rounded-sm relative">
                      <div className="w-4 h-1.5 bg-black rounded-sm absolute top-0.5 left-0.5"></div>
                    </div>
                    <div className="w-0.5 h-1.5 bg-black rounded-r-sm ml-0.5"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Screen Content */}
            <div className="w-[375px] h-[812px] overflow-hidden relative">
              <div className="absolute inset-0 pt-12">
                {children}
              </div>
            </div>
            
            {/* Home Indicator (iPhone style) */}
            {deviceType === 'iphone' && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-32 h-1 bg-black rounded-full opacity-60"></div>
              </div>
            )}
          </div>
          
          {/* Hardware Buttons */}
          <div className="absolute right-[-2px] top-20">
            <div className="w-1 h-12 bg-gray-800 rounded-r-sm"></div>
          </div>
          <div className="absolute right-[-2px] top-36">
            <div className="w-1 h-8 bg-gray-800 rounded-r-sm"></div>
          </div>
          <div className="absolute right-[-2px] top-48">
            <div className="w-1 h-8 bg-gray-800 rounded-r-sm"></div>
          </div>
          
          {/* Left side button */}
          <div className="absolute left-[-2px] top-24">
            <div className="w-1 h-6 bg-gray-800 rounded-l-sm"></div>
          </div>
        </div>
        
        {/* Device Info */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
            <p className="text-sm font-medium text-gray-700">iPhone 14 Pro Simulator</p>
            <p className="text-xs text-gray-500">375 × 812 viewport</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDeviceFrame;