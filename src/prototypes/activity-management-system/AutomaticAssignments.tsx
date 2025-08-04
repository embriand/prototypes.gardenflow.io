import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Users, CalendarDays, Layers, UserIcon, Search } from 'lucide-react';
import { Input } from '../../components/ui/input';

interface Assignment {
  eventId: string;
  userId: string;
  groupId: string;
  activityId: string;
}

interface AutomaticAssignmentsProps {
  automaticAssignments: Assignment[];
  generateAutomaticAssignments: () => void;
  handleSendNotification: () => void;
  events: { id: string; name: string }[];
  users: { id: string; name: string }[];
  groups: { id: string; name: string }[];
  activities: { id: string; name: string }[];
}

type GroupingOption = 'user' | 'event' | 'group' | 'activity';

export const AutomaticAssignments: React.FC<AutomaticAssignmentsProps> = ({
  automaticAssignments,
  generateAutomaticAssignments,
  handleSendNotification,
  events,
  users,
  groups,
  activities,
}) => {
  const [groupBy, setGroupBy] = useState<GroupingOption>('user');
  const [searchTerm, setSearchTerm] = useState('');

  // Process assignments based on grouping option and search term
  const groupedAssignments = useMemo(() => {
    // First apply search filter if there's a search term
    let filteredAssignments = automaticAssignments;
    
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      
      filteredAssignments = automaticAssignments.filter(assignment => {
        // Find related objects
        const event = events.find(e => e.id === assignment.eventId);
        const user = users.find(u => u.id === assignment.userId);
        const group = groups.find(g => g.id === assignment.groupId);
        const activity = activities.find(a => a.id === assignment.activityId);
        
        // Search in all fields
        return (
          (event?.name.toLowerCase().includes(term) || false) ||
          (user?.name.toLowerCase().includes(term) || false) ||
          (group?.name.toLowerCase().includes(term) || false) ||
          (activity?.name.toLowerCase().includes(term) || false)
        );
      });
    }
    
    // Then group the filtered assignments
    if (filteredAssignments.length === 0) {
      return {};
    }

    return filteredAssignments.reduce((acc, assignment) => {
      let groupKey = '';
      let groupName = '';

      if (groupBy === 'user') {
        groupKey = assignment.userId;
        const user = users.find(u => u.id === assignment.userId);
        groupName = user ? user.name : 'Unknown User';
      } else if (groupBy === 'event') {
        groupKey = assignment.eventId;
        const event = events.find(e => e.id === assignment.eventId);
        groupName = event ? event.name : 'Unknown Event';
      } else if (groupBy === 'group') {
        groupKey = assignment.groupId;
        const group = groups.find(g => g.id === assignment.groupId);
        groupName = group ? group.name : 'Unknown Group';
      } else if (groupBy === 'activity') {
        groupKey = assignment.activityId;
        const activity = activities.find(a => a.id === assignment.activityId);
        groupName = activity ? activity.name : 'Unknown Activity';
      }

      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(assignment);
      return acc;
    }, {} as Record<string, Assignment[]>);
  }, [automaticAssignments, groupBy, searchTerm, events, users, groups, activities]);

  const totalFilteredAssignments = useMemo(() => {
    return Object.values(groupedAssignments).reduce((sum, assignments) => sum + assignments.length, 0);
  }, [groupedAssignments]);

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Automatic Assignments</CardTitle>
            <CardDescription>
              View and confirm automatically generated assignments
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={generateAutomaticAssignments}
            >
              Regenerate
            </Button>
            <Button
              onClick={handleSendNotification}
              disabled={automaticAssignments.length === 0}
            >
              Send Notifications
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Search and grouping controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">Group by:</span>
              <Tabs value={groupBy} onValueChange={(value) => setGroupBy(value as GroupingOption)} className="w-auto">
                <TabsList>
                  <TabsTrigger value="user" className="flex items-center gap-1 px-2 py-1">
                    <UserIcon size={14} />
                    <span>User</span>
                  </TabsTrigger>
                  <TabsTrigger value="event" className="flex items-center gap-1 px-2 py-1">
                    <CalendarDays size={14} />
                    <span>Event</span>
                  </TabsTrigger>
                  <TabsTrigger value="group" className="flex items-center gap-1 px-2 py-1">
                    <Users size={14} />
                    <span>Group</span>
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="flex items-center gap-1 px-2 py-1">
                    <Layers size={14} />
                    <span>Activity</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Status info */}
          {searchTerm && (
            <div className="text-sm text-slate-600">
              Showing {totalFilteredAssignments} of {automaticAssignments.length} assignments
            </div>
          )}

          {/* Assignments table */}
          <div className="space-y-6">
            {Object.entries(groupedAssignments).length > 0 ? (
              Object.entries(groupedAssignments).map(([groupName, assignments]) => (
                <div key={groupName} className="space-y-2">
                  <h3 className="text-md font-semibold bg-slate-100 p-2 rounded">
                    {groupName} ({assignments.length})
                  </h3>
                  
                  <div className="border rounded overflow-hidden">
                    <table className="min-w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          {groupBy !== 'user' && <th className="px-4 py-2 text-left text-sm font-medium">User</th>}
                          {groupBy !== 'event' && <th className="px-4 py-2 text-left text-sm font-medium">Event</th>}
                          {groupBy !== 'group' && <th className="px-4 py-2 text-left text-sm font-medium">Group</th>}
                          {groupBy !== 'activity' && <th className="px-4 py-2 text-left text-sm font-medium">Activity</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {assignments.map((assignment, index) => {
                          const event = events.find(e => e.id === assignment.eventId);
                          const user = users.find(u => u.id === assignment.userId);
                          const group = groups.find(g => g.id === assignment.groupId);
                          const activity = activities.find(a => a.id === assignment.activityId);

                          return (
                            <tr key={index} className="hover:bg-slate-50">
                              {groupBy !== 'user' && (
                                <td className="px-4 py-3">{user ? user.name : 'Unknown User'}</td>
                              )}
                              {groupBy !== 'event' && (
                                <td className="px-4 py-3">{event ? event.name : 'Unknown Event'}</td>
                              )}
                              {groupBy !== 'group' && (
                                <td className="px-4 py-3">{group ? group.name : 'Unknown Group'}</td>
                              )}
                              {groupBy !== 'activity' && (
                                <td className="px-4 py-3">{activity ? activity.name : 'Unknown Activity'}</td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="border rounded p-10 text-center text-slate-500">
                {automaticAssignments.length === 0 
                  ? "No automatic assignments generated. Click \"Regenerate\" to create assignments."
                  : "No matching assignments found. Try adjusting your search."}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomaticAssignments;