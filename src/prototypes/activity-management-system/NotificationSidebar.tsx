import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Calendar } from 'lucide-react';

type Notification = {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  eventId?: string; // Add eventId property
};

type Event = {
  id: string;
  name: string;
  content?: string;
  date?: string;
};

const NotificationSidebar = ({
  users,
  selectedUser,
  setSelectedUser,
  notifications,
  markAsRead,
  clearNotifications,
  formatTimestamp,
  formatDate,
  events
}: {
  users: { id: string; name: string }[];
  selectedUser: string;
  setSelectedUser: (userId: string) => void;
  notifications: { [key: string]: Notification[] };
  markAsRead: (userId: string, notificationId: string) => void;
  clearNotifications: (userId: string) => void;
  formatTimestamp: (timestamp: string) => string;
  formatDate: (date: string) => string;
  events: Event[];
}) => (
  <div className="w-80 border-l bg-slate-50 p-4 flex flex-col h-screen">
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-2">User Notifications</h3>
      <Select value={selectedUser} onValueChange={setSelectedUser}>
        <SelectTrigger>
          <SelectValue placeholder="Select user" />
        </SelectTrigger>
        <SelectContent>
          {users.map(user => (
            <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="flex-1 overflow-auto space-y-4">
      <div className="flex flex-col items-center mb-4">
        <h4 className="text-sm font-medium text-slate-700 mb-2">
          {selectedUser && notifications[selectedUser]?.length > 0
            ? `${notifications[selectedUser].length} Notifications`
            : 'No notifications'}
        </h4>
        {selectedUser && notifications[selectedUser]?.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            className="text-xs text-red-500 hover:text-red-700"
            onClick={() => clearNotifications(selectedUser)}
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {selectedUser && notifications[selectedUser]?.map((notification: Notification) => {
          const eventId = notification.eventId;
          const event = events.find((e: Event) => e.id === eventId);

          return (
            <div
              key={notification.id}
              className={`p-3 rounded-lg shadow-sm ${notification.read ? 'bg-white' : 'bg-blue-50 border-l-4 border-blue-500'}`}
              onClick={() => markAsRead(selectedUser, notification.id)}
            >
              <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{event?.name || 'Event'}</h3>
            <span className="text-xs text-slate-500">{formatTimestamp(notification.timestamp)}</span>
              </div>
              <div className="text-sm">
            {event?.content && (
              <div dangerouslySetInnerHTML={{ __html: event.content }} />
            )}
            {!event?.content && (
              <div>{notification.message}</div>
            )}
              </div>
              {event?.date && (
            <div className="mt-2 text-xs font-medium flex items-center">
              <Calendar size={12} className="mr-1" />
              {formatDate(event.date)}
            </div>
              )}
            </div>
          );
        })}
        {(!selectedUser || !notifications[selectedUser] || notifications[selectedUser].length === 0) && (
          <div className="text-center py-10 text-slate-500">
            No notifications found.
          </div>
        )}
      </div>
    </div>
  </div>
);

export default NotificationSidebar;
