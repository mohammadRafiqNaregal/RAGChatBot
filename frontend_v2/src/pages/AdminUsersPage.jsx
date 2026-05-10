import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { USER_ROLE_OPTIONS } from '@/features/auth/authSlice';
import {
  clearUsersState,
  createUser,
  fetchUsers,
} from '@/features/users/usersSlice';

const initialForm = {
  username: '',
  email: '',
  password: '',
  role: 'Employee',
};

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const { items, isLoading, isCreating, error, createError, lastCreatedUser } =
    useSelector((state) => state.users);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    dispatch(fetchUsers());
    return () => {
      dispatch(clearUsersState());
    };
  }, [dispatch]);

  const sortedUsers = useMemo(
    () =>
      [...items].sort((a, b) =>
        String(a.username || '').localeCompare(String(b.username || '')),
      ),
    [items],
  );

  const updateField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    dispatch(clearUsersState());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(
      createUser({
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      }),
    );

    if (createUser.fulfilled.match(result)) {
      setForm(initialForm);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <Badge variant="secondary">Admin Only</Badge>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Admins create internal users, assign roles, and set an initial
                password. Self-registration is disabled.
              </CardDescription>
            </div>
            <Badge variant="outline">Total users: {sortedUsers.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
              <CardDescription>
                Create a new internal account with role assignment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                {createError ? (
                  <Alert variant="destructive">
                    <AlertTitle>Could not create user</AlertTitle>
                    <AlertDescription>{createError}</AlertDescription>
                  </Alert>
                ) : null}

                {lastCreatedUser ? (
                  <Alert>
                    <AlertTitle>User created</AlertTitle>
                    <AlertDescription>
                      {lastCreatedUser.username} has been added successfully.
                    </AlertDescription>
                  </Alert>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="new-username">Username</Label>
                  <Input
                    id="new-username"
                    onChange={updateField('username')}
                    placeholder="john.doe"
                    required
                    value={form.username}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-email">Email</Label>
                  <Input
                    id="new-email"
                    onChange={updateField('email')}
                    placeholder="john.doe@company.com"
                    required
                    type="email"
                    value={form.email}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Initial Password</Label>
                  <Input
                    id="new-password"
                    onChange={updateField('password')}
                    placeholder="Set a temporary password"
                    required
                    type="password"
                    value={form.password}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-role">Role</Label>
                  <Select
                    onValueChange={(value) =>
                      setForm((current) => ({ ...current, role: value }))
                    }
                    value={form.role}
                  >
                    <SelectTrigger className="w-full" id="new-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLE_OPTIONS.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button onClick={resetForm} type="button" variant="outline">
                    Reset
                  </Button>
                  <Button disabled={isCreating} type="submit">
                    {isCreating ? 'Creating...' : 'Create User'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Existing Users</CardTitle>
              <CardDescription>
                Internal accounts currently available in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <Alert variant="destructive">
                  <AlertTitle>Could not load users</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              {isLoading ? (
                <div className="text-sm text-muted-foreground">
                  Loading users...
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedUsers.length > 0 ? (
                      sortedUsers.map((user) => (
                        <TableRow
                          key={user.id || `${user.username}-${user.email}`}
                        >
                          <TableCell className="font-medium">
                            {user.username}
                          </TableCell>
                          <TableCell>{user.email || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {user.role || 'Employee'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          className="text-muted-foreground"
                          colSpan={3}
                        >
                          No users created yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
