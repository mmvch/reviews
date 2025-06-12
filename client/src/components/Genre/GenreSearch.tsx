import CloseIcon from '@mui/icons-material/Close';
import GenreFilter from '../../models/filters/GenreFilter';
import SearchIcon from '@mui/icons-material/Search';
import { blue, teal } from '@mui/material/colors';
import { Box, IconButton, TextField } from '@mui/material';

interface GenreSearchProps {
  filter: GenreFilter;
  setFilter: React.Dispatch<React.SetStateAction<GenreFilter>>;
}

const GenreSearch: React.FC<GenreSearchProps> = ({ filter, setFilter }) => {
  const handleNameFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({
      ...prev,
      currentPage: 0,
      name: event.target.value,
    }));
  };

  const handleNameFilterClear = () => {
    setFilter(prev => ({
      ...prev,
      currentPage: 0,
      name: '',
    }));
  };

  return (
    <Box sx={{ p: 1, backgroundColor: teal[100] }}>
      <TextField
        size="small"
        label="Genre Name"
        value={filter.name || ''}
        onChange={handleNameFilterChange}
        slotProps={{
          input: {
            sx: { backgroundColor: blue[50] },
            endAdornment: filter.name && (
              <IconButton onClick={handleNameFilterClear} edge="end">
                <CloseIcon />
              </IconButton>
            ),
            startAdornment: <SearchIcon color="disabled" />,
          },
        }}
      />
    </Box>
  );
};

export default GenreSearch;
