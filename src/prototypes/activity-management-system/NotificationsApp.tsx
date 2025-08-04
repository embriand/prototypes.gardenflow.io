import React from 'react';
import NotificationsScreen from './NotificationsScreen';
import { DataProvider } from './DataContext';

const NotificationsApp: React.FC = () => {
  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-50">
        <NotificationsScreen standalone={true} />
      </div>
    </DataProvider>
  );
};

export default NotificationsApp;