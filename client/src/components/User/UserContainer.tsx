import toast from 'react-hot-toast';
import User from '../../models/User';
import UserFilter from '../../models/filters/UserFilter';
import UserSearch from './UserSearch';
import UserService from '../../services/UserService';
import UserTable from './UserTable';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

const UserContainer: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const [filter, setFilter] = useState<UserFilter>({
    name: '',
    roleName: '',
    currentPage: 0,
    pageSize: 10
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getFilteredList(filter);
        setUsers(response.data ?? []);
        setTotalAmount(response.totalAmount ?? 0);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchUsers();
  }, [filter]);

  const handleUserRoleChange = (userId: string, roleName: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: { name: roleName } } : user
      )
    );
  }

  return (
    <Box sx={{ minWidth: 420, width: 'fit-content', height: 'fit-content' }}>
      <UserSearch filter={filter} setFilter={setFilter} />

      <UserTable
        users={users}
        totalAmount={totalAmount}
        filter={filter}
        setFilter={setFilter}
        onUserRoleChange={handleUserRoleChange}
      />
    </Box>
  );
}

export default UserContainer;
