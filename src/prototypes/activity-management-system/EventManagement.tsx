import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Typography
} from '@mui/material';
import { PlusCircle, Bell, Newspaper } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { DisplayCategory } from './types';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  activities: string[];
  groups: string[];
  content: string;
  displayCategory?: DisplayCategory;
}

interface EventManagementProps {
  events: Event[];
  eventDialogOpen: boolean;
  setEventDialogOpen: (open: boolean) => void;
  editingEvent: Event | null;
  setEditingEvent: (event: Event | null) => void;
  newEvent: Omit<Event, 'id'>;
  setNewEvent: (event: Omit<Event, 'id'>) => void;
  addEvent: () => void;
  updateEvent: () => void;
  deleteEvent: (id: string) => void;
  formatDate: (dateString: string) => string;
  direction: 'ltr' | 'rtl';
  groups: { id: string; name: string }[];
  activities: { id: string; name: string; description?: string }[];
}

export const EventManagement: React.FC<EventManagementProps> = ({
  events,
  eventDialogOpen,
  setEventDialogOpen,
  editingEvent,
  setEditingEvent,
  newEvent,
  setNewEvent,
  addEvent,
  updateEvent,
  deleteEvent,
  formatDate,
  direction,
  groups,
  activities,
}) => {
  // Function to render display category badge
  const renderDisplayCategoryBadge = (displayCategory?: DisplayCategory) => {
    switch (displayCategory) {
      case 'notification':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Bell size={12} className="mr-1" />
            Notification
          </div>
        );
      case 'actuality':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Newspaper size={12} className="mr-1" />
            Actualité
          </div>
        );
      case 'both':
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Bell size={12} className="mr-1" />
            <Newspaper size={12} className="mx-1" />
            Les deux
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Bell size={12} className="mr-1" />
            Par défaut
          </div>
        );
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Event Management</CardTitle>
        <div className="text-sm text-muted-foreground">
          Create and manage events across groups and activities
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Events</h3>
            <Button 
              variant="contained" 
              startIcon={<PlusCircle size={16} />}
              onClick={() => {
                setEditingEvent(null);
                setNewEvent({ 
                  name: '', 
                  description: '', 
                  date: '', 
                  activities: [], 
                  groups: [], 
                  content: '',
                  displayCategory: 'both' // Default to both
                });
                setEventDialogOpen(true);
              }}
            >
              Create Event
            </Button>
            <Dialog 
              open={eventDialogOpen} 
              onClose={() => setEventDialogOpen(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </DialogTitle>
              <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {editingEvent ? 'Update event details and assignments.' : 'Enter event details and assign groups and activities.'}
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Event Name"
                    value={editingEvent ? editingEvent.name : newEvent.name}
                    onChange={(e) => editingEvent
                      ? setEditingEvent({ ...editingEvent, name: e.target.value })
                      : setNewEvent({ ...newEvent, name: e.target.value })
                    }
                    variant="outlined"
                  />

                  {/* Display Category Selector */}
                  <FormControl fullWidth>
                    <InputLabel>Display As</InputLabel>
                    <Select
                      value={editingEvent ? editingEvent.displayCategory || 'both' : newEvent.displayCategory || 'both'}
                      label="Display As"
                      onChange={(e) => {
                        const value = e.target.value as DisplayCategory;
                        editingEvent
                          ? setEditingEvent({ ...editingEvent, displayCategory: value })
                          : setNewEvent({ ...newEvent, displayCategory: value });
                      }}
                    >
                      <MenuItem value="notification">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Bell size={14} style={{ marginRight: 8, color: '#3b82f6' }} />
                          <span>Notification Only</span>
                        </Box>
                      </MenuItem>
                      <MenuItem value="actuality">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Newspaper size={14} style={{ marginRight: 8, color: '#10b981' }} />
                          <span>Actualité Only</span>
                        </Box>
                      </MenuItem>
                      <MenuItem value="both">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Bell size={14} style={{ marginRight: 8, color: '#8b5cf6' }} />
                          <Newspaper size={14} style={{ marginRight: 8, color: '#8b5cf6' }} />
                          <span>Both</span>
                        </Box>
                      </MenuItem>
                    </Select>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Choose where this event will appear in the app.
                    </Typography>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={editingEvent ? editingEvent.description : newEvent.description}
                    onChange={(e) => editingEvent
                      ? setEditingEvent({ ...editingEvent, description: e.target.value })
                      : setNewEvent({ ...newEvent, description: e.target.value })
                    }
                    variant="outlined"
                  />

                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Content
                    </Typography>
                    <RichTextEditor
                      id="event-content"
                      value={editingEvent ? editingEvent.content : newEvent.content}
                      onChange={(value) =>
                        editingEvent
                          ? setEditingEvent({ ...editingEvent, content: value })
                          : setNewEvent({ ...newEvent, content: value })
                      }
                      direction={direction}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    value={editingEvent ? editingEvent.date : newEvent.date}
                    onChange={(e) => editingEvent
                      ? setEditingEvent({ ...editingEvent, date: e.target.value })
                      : setNewEvent({ ...newEvent, date: e.target.value })
                    }
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Assign Groups
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {groups.map(group => (
                        <FormControlLabel
                          key={group.id}
                          control={
                            <Checkbox 
                              checked={editingEvent 
                                ? editingEvent.groups.includes(group.id)
                                : newEvent.groups.includes(group.id)
                              }
                              onChange={(e) => {
                                const checked = e.target.checked;
                                if (editingEvent) {
                                  const updatedGroups = checked 
                                    ? [...editingEvent.groups, group.id]
                                    : editingEvent.groups.filter(g => g !== group.id);
                                  setEditingEvent({ ...editingEvent, groups: updatedGroups });
                                } else {
                                  const updatedGroups = checked 
                                    ? [...newEvent.groups, group.id]
                                    : newEvent.groups.filter(g => g !== group.id);
                                  setNewEvent({ ...newEvent, groups: updatedGroups });
                                }
                              }}
                            />
                          }
                          label={group.name}
                        />
                      ))}
                      {groups.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                          No groups available. Create groups first.
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Assign Activities
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {activities.map(activity => (
                        <FormControlLabel
                          key={activity.id}
                          control={
                            <Checkbox 
                              checked={editingEvent 
                                ? editingEvent.activities.includes(activity.id)
                                : newEvent.activities.includes(activity.id)
                              }
                              onChange={(e) => {
                                const checked = e.target.checked;
                                if (editingEvent) {
                                  const updatedActivities = checked 
                                    ? [...editingEvent.activities, activity.id]
                                    : editingEvent.activities.filter(a => a !== activity.id);
                                  setEditingEvent({ ...editingEvent, activities: updatedActivities });
                                } else {
                                  const updatedActivities = checked 
                                    ? [...newEvent.activities, activity.id]
                                    : newEvent.activities.filter(a => a !== activity.id);
                                  setNewEvent({ ...newEvent, activities: updatedActivities });
                                }
                              }}
                            />
                          }
                          label={activity.name}
                        />
                      ))}
                      {activities.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                          No activities available. Create activities first.
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEventDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={editingEvent ? updateEvent : addEvent}
                >
                  {editingEvent ? 'Update' : 'Create'} Event
                </Button>
              </DialogActions>
            </Dialog>
          </div>

          <div className="space-y-4">
            {events.map(event => (
              <Card key={event.id} className="border">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    {renderDisplayCategoryBadge(event.displayCategory)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {event.description && <div className="mb-1">{event.description}</div>}
                    <div className="font-medium text-slate-700 mt-1">Date: {formatDate(event.date)}</div>
                  </div>
                </CardHeader>

                {event.content && (
                  <CardContent className="pt-0 pb-2 border-b">
                    <div
                      className="rich-content-container"
                      dangerouslySetInnerHTML={{ __html: event.content }}
                    />
                  </CardContent>
                )}

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Assigned Groups</h4>
                      <div className="space-y-1">
                        {event.groups.map(groupId => {
                          const group = groups.find(g => g.id === groupId);
                          return group ? (
                            <div key={groupId} className="p-2 bg-slate-50 rounded text-sm">
                              {group.name}
                            </div>
                          ) : null;
                        })}
                        {event.groups.length === 0 && (
                          <div className="p-2 bg-slate-50 rounded text-sm text-slate-500 italic">
                            No groups assigned
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Assigned Activities</h4>
                      <div className="space-y-1">
                        {event.activities.map(activityId => {
                          const activity = activities.find(a => a.id === activityId);
                          return activity ? (
                            <div key={activityId} className="p-2 bg-slate-50 rounded text-sm">
                              {activity.name}
                            </div>
                          ) : null;
                        })}
                        {event.activities.length === 0 && (
                          <div className="p-2 bg-slate-50 rounded text-sm text-slate-500 italic">
                            No activities assigned
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setEditingEvent(event);
                        setEventDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => deleteEvent(event.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}

            {events.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                No events found. Create an event to get started.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventManagement;