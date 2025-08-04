import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

type Assignment = {
  id: string;
  userId: string;
  groupId: string;
};

type User = {
  id: string;
  name: string;
};

type Group = {
  id: string;
  name: string;
};

type UserAssignmentsProps = {
  users: User[];
  groups: Group[];
  newAssignment: Assignment;
  setNewAssignment: (assignment: Assignment) => void;
  addAssignment: () => void;
  assignments: Assignment[];
  deleteAssignment: (id: string) => void;
};

const UserAssignments: React.FC<UserAssignmentsProps> = ({
  users,
  groups,
  newAssignment,
  setNewAssignment,
  addAssignment,
  assignments,
  deleteAssignment
}) => (
  <Card>
    <CardContent sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        User Assignments
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Assign users to groups and activities
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Select User</InputLabel>
            <Select
              value={newAssignment.userId}
              label="Select User"
              onChange={(e) => setNewAssignment({ ...newAssignment, userId: e.target.value })}
            >
              {users.map(user => (
                <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Assign to Group</InputLabel>
            <Select
              value={newAssignment.groupId}
              label="Assign to Group"
              onChange={(e) => setNewAssignment({ ...newAssignment, groupId: e.target.value })}
            >
              {groups.map(group => (
                <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box sx={{ display: 'flex', alignItems: 'end' }}>
            <Button variant="contained" fullWidth onClick={addAssignment}>
              Create Assignment
            </Button>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Current Assignments
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="subtitle2">User</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Group</Typography></TableCell>
                  <TableCell><Typography variant="subtitle2">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment: Assignment) => {
                  const user = users.find((u: User) => u.id === assignment.userId);
                  const group = groups.find((g: Group) => g.id === assignment.groupId);

                  return (
                    <TableRow key={assignment.id}>
                      <TableCell>{user ? user.name : 'Unknown User'}</TableCell>
                      <TableCell>{group ? group.name : 'Unknown Group'}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => deleteAssignment(assignment.id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {assignments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No assignments found. Create an assignment to get started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default UserAssignments;
