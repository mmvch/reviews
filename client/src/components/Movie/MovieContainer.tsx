import Loader from '../Loader';
import Movie from '../../models/Movie';
import MovieFilter from '../../models/filters/MovieFilter';
import MovieGrid from './MovieGrid';
import MovieSearch from './MovieSearch';
import MovieService from '../../services/MovieService';
import PartialData from '../../models/utils/PartialData';
import toast from 'react-hot-toast';
import { Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

type FetchMoviesFunc = (filter: MovieFilter) => Promise<PartialData<Movie>>;

const MovieContainer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const initialFilter: MovieFilter = useMemo(() => ({
    name: '',
    genreIds: [],
    currentPage: 0,
    pageSize: 24,
  }), []);

  const [filter, setFilter] = useState<MovieFilter>({ ...initialFilter });
  const [moviesFunc, setMoviesFunc] = useState<FetchMoviesFunc>();

  const location = useLocation();

  useEffect(() => {
    setFilter({ ...initialFilter });

    const lastSegment = location.pathname.split('/').pop();
    const fetchMoviesFunc = lastSegment === 'recommendations'
      ? MovieService.getRecommendations
      : MovieService.getFilteredList;

    setMoviesFunc(() => fetchMoviesFunc);
  }, [location.pathname, initialFilter]);

  useEffect(() => {
    const fetchMovies = async (filter: MovieFilter, moviesFunc: FetchMoviesFunc) => {
      try {
        setIsLoading(true);
        const response = await moviesFunc(filter);
        setMovies(response.data ?? []);
        setTotalAmount(response.totalAmount ?? 0);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (moviesFunc) {
      fetchMovies(filter, moviesFunc);
    }

  }, [filter, moviesFunc]);

  return (
    <>
      <MovieSearch filter={filter} setFilter={setFilter} />

      {isLoading ? (
        <Loader size={80} thickness={6} />
      ) :
        (totalAmount !== 0 ? (
          <MovieGrid
            movies={movies}
            totalAmount={totalAmount}
            filter={filter}
            setFilter={setFilter}
            sx={{ mt: 2, mb: 6 }}
          />
        ) : (
          <Typography mt={2} variant="h6" textAlign="center" color='info'>No suitable movies</Typography>
        )
        )}
    </>
  );
}

export default MovieContainer;
