import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { PlusCircle, Edit, Trash } from 'lucide-react';

import { Activity, Group } from './types';

interface GroupsActivitiesProps {
  groups: Group[];
  groupDialogOpen: boolean;
  setGroupDialogOpen: (open: boolean) => void;
  editingGroup: Group | null;
  setEditingGroup: (group: Group | null) => void;
  newGroup: Group;
  setNewGroup: (group: Group) => void;
  addGroup: () => void;
  updateGroup: () => void;
  deleteGroup: (id: string) => void;
  activities: Activity[];
  activityDialogOpen: boolean;
  setActivityDialogOpen: (open: boolean) => void;
  editingActivity: Activity | null;
  setEditingActivity: (activity: Activity | null) => void;
  newActivity: Activity;
  setNewActivity: (activity: Activity) => void;
  addActivity: () => void;
  updateActivity: () => void;
  deleteActivity: (id: string) => void;
}

const GroupsActivities: React.FC<GroupsActivitiesProps> = ({
  groups,
  groupDialogOpen,
  setGroupDialogOpen,
  editingGroup,
  setEditingGroup,
  newGroup,
  setNewGroup,
  addGroup,
  updateGroup,
  deleteGroup,
  activities,
  activityDialogOpen,
  setActivityDialogOpen,
  editingActivity,
  setEditingActivity,
  newActivity,
  setNewActivity,
  addActivity,
  updateActivity,
  deleteActivity
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Groups Management</CardTitle>
        <CardDescription>Create and manage groups</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Groups</h3>
            <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2" onClick={() => {
                  setEditingGroup(null);
                  setNewGroup({ id: '', name: '' });
                }}>
                  <PlusCircle size={16} />
                  <span>Add Group</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingGroup ? 'Edit Group' : 'Add New Group'}</DialogTitle>
                  <DialogDescription>
                    {editingGroup ? 'Update group details below.' : 'Enter group details below.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="group-name" className="text-right">
                      Group Name
                    </Label>
                    <Input
                      id="group-name"
                      value={editingGroup ? editingGroup.name : newGroup.name}
                      onChange={(e) => editingGroup
                        ? setEditingGroup({ ...editingGroup, name: e.target.value })
                        : setNewGroup({ ...newGroup, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setGroupDialogOpen(false)}>Cancel</Button>
                  <Button onClick={editingGroup ? updateGroup : addGroup}>
                    {editingGroup ? 'Update' : 'Add'} Group
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2">
            {groups.map(group => (
              <div key={group.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                <span>{group.name}</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => {
                    setEditingGroup(group);
                    setGroupDialogOpen(true);
                  }}>
                    <Edit size={16} />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deleteGroup(group.id)}>
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
            {groups.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                No groups found. Add a group to get started.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Activities Management</CardTitle>
        <CardDescription>Create and manage activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Activities</h3>
            <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2" onClick={() => {
                  setEditingActivity(null);
                  setNewActivity({ id: '', name: '', description: '' });
                }}>
                  <PlusCircle size={16} />
                  <span>Add Activity</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
                  <DialogDescription>
                    {editingActivity ? 'Update activity details below.' : 'Enter activity details below.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="activity-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="activity-name"
                      value={editingActivity ? editingActivity.name : newActivity.name}
                      onChange={(e) => editingActivity
                        ? setEditingActivity({ ...editingActivity, name: e.target.value })
                        : setNewActivity({ ...newActivity, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="activity-description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="activity-description"
                      value={editingActivity ? editingActivity.description : newActivity.description}
                      onChange={(e) => editingActivity
                        ? setEditingActivity({ ...editingActivity, description: e.target.value })
                        : setNewActivity({ ...newActivity, description: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setActivityDialogOpen(false)}>Cancel</Button>
                  <Button onClick={editingActivity ? updateActivity : addActivity}>
                    {editingActivity ? 'Update' : 'Add'} Activity
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2">
            {activities.map(activity => (
              <div key={activity.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                <div>
                  <div className="font-medium">{activity.name}</div>
                  {activity.description && (
                    <div className="text-sm text-slate-500">{activity.description}</div>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => {
                    setEditingActivity(activity);
                    setActivityDialogOpen(true);
                  }}>
                    <Edit size={16} />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deleteActivity(activity.id)}>
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <div className="text-center py-10 text-slate-500">
                No activities found. Add an activity to get started.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default GroupsActivities;
