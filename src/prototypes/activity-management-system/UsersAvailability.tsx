import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { PlusCircle, Edit, Trash } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  availability: Record<string, string[]>;
}

interface UsersAvailabilityProps {
  users: User[];
  userDialogOpen: boolean;
  setUserDialogOpen: (open: boolean) => void;
  editingUser: User | null;
  setEditingUser: (user: User | null) => void;
  newUser: User;
  setNewUser: (user: User) => void;
  addUser: () => void;
  updateUser: () => void;
  deleteUser: (id: string) => void;
  availabilityDialogOpen: boolean;
  setAvailabilityDialogOpen: (open: boolean) => void;
  editingAvailability: { userId: string; availability: Record<string, string[]> } | null;
  setEditingAvailability: (availability: { userId: string; availability: Record<string, string[]> } | null) => void;
  updateAvailability: () => void;
  daysOfWeek: string[];
  timeSlots: string[];
}

const UsersAvailability: React.FC<UsersAvailabilityProps> = ({
  users,
  userDialogOpen,
  setUserDialogOpen,
  editingUser,
  setEditingUser,
  newUser,
  setNewUser,
  addUser,
  updateUser,
  deleteUser,
  availabilityDialogOpen,
  setAvailabilityDialogOpen,
  editingAvailability,
  setEditingAvailability,
  updateAvailability,
  daysOfWeek,
  timeSlots
}) => (
  <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Users & Availability Management</CardTitle>
        <CardDescription>
          Register users and manage their weekly availability
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Registered Users</h3>
            <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2" onClick={() => {
                  setEditingUser(null);
                  setNewUser({ id: '', name: '', email: '', availability: {} });
                }}>
                  <PlusCircle size={16} />
                  <span>Add User</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                  <DialogDescription>
                    {editingUser ? 'Update user details below.' : 'Enter user details below.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={editingUser ? editingUser.name : newUser.name}
                      onChange={(e) => editingUser
                        ? setEditingUser({ ...editingUser, name: e.target.value })
                        : setNewUser({ ...newUser, name: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editingUser ? editingUser.email : newUser.email}
                      onChange={(e) => editingUser
                        ? setEditingUser({ ...editingUser, email: e.target.value })
                        : setNewUser({ ...newUser, email: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setUserDialogOpen(false)}>Cancel</Button>
                  <Button onClick={editingUser ? updateUser : addUser}>
                    {editingUser ? 'Update' : 'Add'} User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">User</th>
                  {daysOfWeek.map(day => (
                    <th key={day} className="py-2 px-4 border-b text-center">{day.substring(0, 3)}</th>
                  ))}
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="py-2 px-4">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    {daysOfWeek.map(day => (
                      <td key={day} className="py-2 px-4 text-center">
                        {user.availability[day]?.map((slot, index) => (
                          <div key={index} className="bg-blue-200 text-blue-800 text-xs font-medium mr-1 px-2.5 py-0.5 rounded-full">
                            {slot}
                          </div>
                        ))}
                        {!user.availability[day]?.length && (
                          <div className="text-gray-400 text-xs">Not Available</div>
                        )}
                      </td>
                    ))}
                    <td className="py-2 px-4">
                      <div className="flex gap-2">
                        <Dialog open={availabilityDialogOpen && editingAvailability?.userId === user.id} onOpenChange={(open) => {
                          if (!open) setAvailabilityDialogOpen(false);
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" onClick={() => {
                              setEditingAvailability({
                                userId: user.id,
                                availability: { ...(user.availability || {}) }
                              });
                              setAvailabilityDialogOpen(true);
                            }}>
                              Edit Availability
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Edit User Availability</DialogTitle>
                              <DialogDescription>
                                Set available time slots for each day of the week.
                              </DialogDescription>
                            </DialogHeader>
                            {editingAvailability && (
                              <div className="overflow-y-auto max-h-96">
                                {daysOfWeek.map(day => (
                                  <div key={day} className="mb-4">
                                    <h4 className="font-medium mb-2">{day}</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                      {timeSlots.map(slot => {
                                        const isChecked = editingAvailability.availability[day]?.includes(slot) || false;
                                        return (
                                          <div key={slot} className="flex items-center space-x-2">
                                            <Checkbox
                                              id={`${day}-${slot}`}
                                              checked={isChecked}
                                              onCheckedChange={(checked) => {
                                                const newAvailability = { ...editingAvailability.availability };

                                                if (!newAvailability[day]) {
                                                  newAvailability[day] = [];
                                                }

                                                if (checked) {
                                                  if (!newAvailability[day].includes(slot)) {
                                                    newAvailability[day].push(slot);
                                                  }
                                                } else {
                                                  newAvailability[day] = newAvailability[day].filter(t => t !== slot);

                                                  // Clean up empty arrays
                                                  if (newAvailability[day].length === 0) {
                                                    delete newAvailability[day];
                                                  }
                                                }

                                                setEditingAvailability({
                                                  ...editingAvailability,
                                                  availability: newAvailability
                                                });
                                              }}
                                            />
                                            <Label htmlFor={`${day}-${slot}`}>{slot}</Label>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setAvailabilityDialogOpen(false)}>Cancel</Button>
                              <Button onClick={updateAvailability}>Save Availability</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="ghost" onClick={() => {
                          setEditingUser(user);
                          setUserDialogOpen(true);
                        }}>
                          <Edit size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deleteUser(user.id)}>
                          <Trash size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-gray-500">
                      No users found. Add a user to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
);

export default UsersAvailability;
