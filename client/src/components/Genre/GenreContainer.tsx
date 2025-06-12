import CreateGenre from './CreateGenre';
import Genre from '../../models/Genre';
import GenreFilter from '../../models/filters/GenreFilter';
import GenreSearch from './GenreSearch';
import GenreService from '../../services/GenreService';
import GenreTable from './GenreTable';
import toast from 'react-hot-toast';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

const GenreContainer: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [filter, setFilter] = useState<GenreFilter>({
    name: '',
    currentPage: 0,
    pageSize: 10
  });

  useEffect(() => {
    setGenreList(filter);
  }, [filter]);

  const handleGenreListChange = () => {
    setGenreList(filter);
  };

  const setGenreList = async (filter: GenreFilter) => {
    try {
      const response = await GenreService.getFilteredList(filter);
      setGenres(response.data ?? []);
      setTotalAmount(response.totalAmount ?? 0);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Box sx={{ minWidth: 420, width: 'fit-content', height: 'fit-content' }}>
      <GenreSearch filter={filter} setFilter={setFilter} />

      <GenreTable
        genres={genres}
        totalAmount={totalAmount}
        filter={filter}
        setFilter={setFilter}
        onChange={handleGenreListChange}
      />

      <CreateGenre onCreate={handleGenreListChange} sx={{ mt: 2 }} />
    </Box>
  );
};

export default GenreContainer;
