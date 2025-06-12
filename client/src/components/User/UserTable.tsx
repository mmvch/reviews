import Person3Icon from '@mui/icons-material/Person3';
import Person3OutlinedIcon from '@mui/icons-material/Person3Outlined';
import Person4Icon from '@mui/icons-material/Person4';
import Person4OutlinedIcon from '@mui/icons-material/Person4Outlined';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import toast from 'react-hot-toast';
import User from '../../models/User';
import UserFilter from '../../models/filters/UserFilter';
import UserService from '../../services/UserService';
import { AppRoles } from '../../utils/AppRoles';
import {
  Box,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import { teal } from '@mui/material/colors';

interface UserTableProps {
  users: User[];
  totalAmount: number;
  filter: UserFilter;
  setFilter: React.Dispatch<React.SetStateAction<UserFilter>>;
  onUserRoleChange: (userId: string, roleName: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, totalAmount, filter, setFilter, onUserRoleChange }) => {
  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setFilter(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, currentPage: 0, pageSize: parseInt(event.target.value, 10) }));
  };

  const handleRoleChange = async (userId: string | undefined, roleName: string) => {
    if (userId) {
      try {
        await UserService.update(userId, roleName);
        toast.success("Role successfully changed");
        onUserRoleChange(userId, roleName);
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Box sx={{ p: 1, backgroundColor: teal[100] }}>
      <Paper>
        <TableContainer sx={{ maxHeight: 587 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell padding='none'>
                    <RadioGroup row sx={{ marginInline: 2, justifyContent: 'end' }}>
                      <Radio
                        checked={user.role?.name === AppRoles.Rater}
                        disabled={user.role?.name === AppRoles.Rater}
                        onClick={() => handleRoleChange(user.id, AppRoles.Rater)}
                        icon={<PersonOutlinedIcon />}
                        checkedIcon={<PersonIcon color="secondary" />}
                      />

                      <Radio
                        checked={user.role?.name === AppRoles.Reviewer}
                        disabled={user.role?.name === AppRoles.Reviewer}
                        onClick={() => handleRoleChange(user.id, AppRoles.Reviewer)}
                        icon={<Person3OutlinedIcon />}
                        checkedIcon={<Person3Icon color="secondary" />}
                      />

                      <Radio
                        checked={user.role?.name === AppRoles.Admin}
                        disabled={user.role?.name === AppRoles.Admin}
                        onClick={() => handleRoleChange(user.id, AppRoles.Admin)}
                        icon={<Person4OutlinedIcon />}
                        checkedIcon={<Person4Icon color="secondary" />}
                      />
                    </RadioGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={totalAmount}
          rowsPerPage={filter.pageSize ?? 10}
          page={filter.currentPage ?? 0}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>
    </Box>
  );
}

export default UserTable;
