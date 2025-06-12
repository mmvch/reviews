import CloseIcon from '@mui/icons-material/Close';
import Genre from '../../models/Genre';
import GenreService from '../../services/GenreService';
import MovieFilter from '../../models/filters/MovieFilter';
import SearchIcon from '@mui/icons-material/Search';
import toast from 'react-hot-toast';
import {
  Autocomplete,
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material';
import { blue, teal } from '@mui/material/colors';
import { useEffect, useRef, useState } from 'react';

interface MovieSearchProps {
  filter: MovieFilter;
  setFilter: React.Dispatch<React.SetStateAction<MovieFilter>>;
}

const MovieSearch: React.FC<MovieSearchProps> = ({ filter, setFilter }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);

  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await GenreService.getAll();
        setGenres(response);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreChange = (event: React.SyntheticEvent, value: Genre[]) => {
    setSelectedGenres(value);
    setFilter((prev) => ({
      ...prev,
      currentPage: 0,
      genreIds: value.map((genre) => genre.id).filter((id): id is string => id !== undefined)
    }));
  };

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

  const handlePageSizeChange = (event: SelectChangeEvent) => {
    setFilter(prev => ({
      ...prev,
      currentPage: 0,
      pageSize: parseInt(event.target.value, 10)
    }));
  };

  const handleFocus = () => {
    if (autocompleteRef.current) {
      autocompleteRef.current.style.width = '100%';
    }
  };

  const handleBlur = () => {
    if (autocompleteRef.current) {
      autocompleteRef.current.style.width = 'fit-content';
    }
  };

  return (
    <Box sx={{
      p: 1,
      display: "flex", justifyContent: "space-between",
      backgroundColor: teal[100],
      borderRadius: 2
    }}
    >
      <Box display="flex">
        <TextField
          size="small"
          label="Movie Name"
          name="movie-name"
          value={filter.name || ''}
          onChange={handleNameFilterChange}
          slotProps={{
            input: {
              sx: { backgroundColor: blue[50] },
              endAdornment: (filter.name &&
                <IconButton onClick={handleNameFilterClear} edge="end">
                  <CloseIcon />
                </IconButton>
              ),
              startAdornment: <SearchIcon color="disabled" />
            }
          }}
        />

        <FormControl size="small" sx={{ minWidth: 100, ml: 2 }}>
          <InputLabel>Page Size</InputLabel>
          <Select
            label="Page Size"
            value={filter.pageSize?.toString() || "24"}
            onChange={handlePageSizeChange}
            sx={{ backgroundColor: blue[50] }}
          >
            <MenuItem value="24">24</MenuItem>
            <MenuItem value="36">36</MenuItem>
            <MenuItem value="48">48</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Autocomplete
        multiple
        size="small"
        limitTags={2}
        options={genres}
        getOptionLabel={(option) => option.name || ""}
        value={selectedGenres}
        onChange={handleGenreChange}
        disableCloseOnSelect
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Genres"
            variant="outlined"
            slotProps={{
              input: {
                ...params.InputProps,
                sx: {
                  backgroundColor: blue[50]
                }
              }
            }}
          />)
        }
        slotProps={{
          popper: {
            sx: {
              display: "flex",
              justifyContent: "flex-end"
            },
          }
        }}
        sx={{ width: "fit-content", minWidth: 150, maxWidth: 0.6 }}
        ref={autocompleteRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </Box>
  );
}

export default MovieSearch;
