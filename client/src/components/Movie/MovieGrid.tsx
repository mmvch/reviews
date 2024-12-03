import Grid from '@mui/material/Grid2';
import Movie from '../../models/Movie';
import MovieCard from './MovieCard';
import MovieFilter from '../../models/filters/MovieFilter';
import {
  Box,
  BoxProps,
  Pagination,
  PaginationItem
} from '@mui/material';

interface MovieGridProps extends BoxProps {
  movies: Movie[];
  totalAmount: number;
  filter: MovieFilter;
  setFilter: React.Dispatch<React.SetStateAction<MovieFilter>>;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, totalAmount, filter, setFilter, ...props }) => {
  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setFilter(prev => ({
      ...prev,
      currentPage: newPage - 1
    }));
  };

  return (
    <Box {...props}>
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        {movies.map((movie) => (
          <Grid key={movie.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
            <MovieCard movie={movie} />
          </Grid>)
        )}
      </Grid>

      {totalAmount !== 0 &&
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.ceil(totalAmount / (filter.pageSize ?? 10))}
            page={(filter?.currentPage ?? 0) + 1}
            onChange={handlePageChange}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                disabled={item.type === 'page' ?
                  item.page === (filter?.currentPage ?? 0) + 1 :
                  item.disabled}
              />
            )}
          />
        </Box>
      }
    </Box>
  );
}

export default MovieGrid;
