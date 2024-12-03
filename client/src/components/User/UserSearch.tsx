import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import UserFilter from '../../models/filters/UserFilter';
import { AppRoles } from '../../utils/AppRoles';
import { blue, teal } from '@mui/material/colors';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material';

interface UserSearchProps {
  filter: UserFilter;
  setFilter: React.Dispatch<React.SetStateAction<UserFilter>>;
}

const UserSearch: React.FC<UserSearchProps> = ({ filter, setFilter }) => {
  const handleNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prev) => ({
      ...prev,
      currentPage: 0,
      name: event.target.value,
    }));
  };

  const handleNameFilterClear = () => {
    setFilter(prev => ({
      ...prev,
      currentPage: 0,
      name: ""
    }));
  };

  const handleRoleFilterChange = (event: SelectChangeEvent) => {
    setFilter((prev) => ({
      ...prev,
      currentPage: 0,
      roleName: event.target.value,
    }));
  };

  return (
    <Box sx={{ p: 1, display: "flex", justifyContent: "space-between", backgroundColor: teal[100] }}>
      <TextField
        size="small"
        label="Username"
        value={filter.name || ''}
        onChange={handleNameFilterChange}
        sx={{ backgroundColor: blue[50], borderRadius: 1 }}
        slotProps={{
          input: {
            endAdornment: (filter.name &&
              <IconButton onClick={handleNameFilterClear} edge="end">
                <CloseIcon />
              </IconButton>
            ),
            startAdornment: <SearchIcon color="disabled" />
          }
        }}
      />

      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>Role</InputLabel>
        <Select
          label="Role"
          value={filter.roleName || ''}
          onChange={handleRoleFilterChange}
          sx={{ backgroundColor: blue[50] }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={AppRoles.Rater}>{AppRoles.Rater}</MenuItem>
          <MenuItem value={AppRoles.Reviewer}>{AppRoles.Reviewer}</MenuItem>
          <MenuItem value={AppRoles.Admin}>{AppRoles.Admin}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default UserSearch;
