'use client';
// app/admin/page.tsx
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { createUserSchema, CreateUserValues } from '@/auth/authSchemas';

type User = {
  id: string;
  name: string;
  username: string;
  phone?: string;
  createdAt: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [creatingUser, setCreatingUser] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: '', username: '', phone: '', password: '' },
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch('/api/admin/users');
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      setUsers(data.users);
    } catch {
      toast.error('Failed to load users.');
    } finally {
      setLoadingUsers(false);
    }
  }, [router]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const onCreateUser = async (values: CreateUserValues) => {
    try {
      setCreatingUser(true);
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      console.log("res")
      console.log(res)
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user.');
      toast.success(`User @${values.username} created.`);
      form.reset();
      setDialogOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCreatingUser(false);
    }
  };

  const onDeleteUser = async (user: User) => {
    if (!confirm(`Delete @${user.username}? This cannot be undone.`)) return;
    try {
      setDeletingId(user.id);
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user.');
      toast.success(`@${user.username} deleted.`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        {/* Users table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage user accounts.</CardDescription>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>+ Create User</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onCreateUser)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name*</FormLabel>
                          <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username*</FormLabel>
                          <FormControl><Input placeholder="johndoe123" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl><Input placeholder="03001234567" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password*</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={creatingUser} className="w-full">
                      {creatingUser ? <><Spinner /> Creating...</> : 'Create User'}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent>
            {loadingUsers ? (
              <div className="flex justify-center py-10"><Spinner /></div>
            ) : users.length === 0 ? (
              <p className="text-center text-muted-foreground py-10">
                No users yet. Create one above.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-2 pr-4 font-medium">Name</th>
                      <th className="py-2 pr-4 font-medium">Username</th>
                      <th className="py-2 pr-4 font-medium">Phone</th>
                      <th className="py-2 pr-4 font-medium">Created</th>
                      <th className="py-2 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 pr-4 font-medium">{user.name}</td>
                        <td className="py-3 pr-4 text-muted-foreground">@{user.username}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{user.phone || '—'}</td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === user.id}
                            onClick={() => onDeleteUser(user)}
                          >
                            {deletingId === user.id ? <Spinner /> : 'Delete'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}