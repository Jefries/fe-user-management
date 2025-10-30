import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUsers, deleteUser } from '@/store/userSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button/button';
import { ImageWithSkeleton } from '@/components/ui/imageWithSkeleton';
import { Trash2, Edit, Eye, UserPlus } from 'lucide-react';
import UserDetailsModal from '../UserDetailsModal/UserDetailsModal';
import UserFormModal from '../UserFormModal/UserFormModal';
import type { User } from '@/types/user';

const UserList = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.users);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormModalOpen(true);
  };

  const handleDelete = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
    }
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setIsFormModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="header flex justify-between items-center mb-8 px-6 py-5 bg-white rounded-full border border-gray-300">
        <h1 className="text-2xl font-bold px-2">User Management</h1>
        <Button
          onClick={handleAddNew}
          className="flex items-center rounded-full md:gap-2"
        >
          <UserPlus className="h-4 w-4" />
          <span className="hidden md:inline">Add New User</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <ImageWithSkeleton
                  src={`https://picsum.photos/seed/${user.id}/100/100`}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <CardTitle className="text-xl">{user.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-8">
                <p className="text-sm">
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Phone:</span> {user.phone}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Company:</span>{' '}
                  {user.company.name}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => handleViewDetails(user)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => handleEdit(user)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <UserDetailsModal
        user={selectedUser}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
      />

      <UserFormModal
        user={editingUser}
        open={isFormModalOpen}
        onOpenChange={setIsFormModalOpen}
      />
    </div>
  );
};

export default UserList;
