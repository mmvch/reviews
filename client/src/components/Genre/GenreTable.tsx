import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Genre from '../../models/Genre';
import GenreFilter from '../../models/filters/GenreFilter';
import GenreService from '../../services/GenreService';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import toast from 'react-hot-toast';
import UpdateGenre from './UpdateGenre';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';
import { teal } from '@mui/material/colors';
import { useState } from 'react';

interface GenreTableProps {
  genres: Genre[];
  totalAmount: number;
  filter: GenreFilter;
  setFilter: React.Dispatch<React.SetStateAction<GenreFilter>>;
  onChange: () => void;
}

const GenreTable: React.FC<GenreTableProps> = ({ genres, totalAmount, filter, setFilter, onChange }) => {
  const [genreToUpdate, setGenreToUpdate] = useState<Genre | null>(null);

  const handleDeleteClick = async (genreId: string | undefined) => {
    if (genreId) {
      try {
        await GenreService.delete(genreId);
        onChange();
        toast.success("Genre successfully deleted");
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handleUpdate = (genre: Genre | null) => {
    if (genre && genreToUpdate?.name !== genre?.name) {
      onChange();
    }

    setGenreToUpdate(null);
  }

  const handleUpdateClick = (genre: Genre) => {
    setGenreToUpdate(genre);
  }

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setFilter(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({
      ...prev,
      currentPage: 0,
      pageSize: parseInt(event.target.value, 10)
    }));
  };

  return (
    <Box sx={{ p: 1, backgroundColor: teal[100] }}>
      <Paper>
        <TableContainer sx={{ maxHeight: 587 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {genres.map((genre) => (
                genre?.id === genreToUpdate?.id ? (
                  <UpdateGenre key={genre.id} genre={genre} onUpdate={handleUpdate} />
                ) : (
                  <TableRow key={genre.id}>
                    <TableCell>{genre.name}</TableCell>
                    <TableCell padding='none'>
                      <Box sx={{ marginInline: 2, display: "flex", justifyContent: 'end' }}>
                        <IconButton onClick={() => handleUpdateClick(genre)}>
                          <ModeEditIcon />
                        </IconButton>

                        <IconButton onClick={() => handleDeleteClick(genre.id)}>
                          <DeleteForeverIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
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

export default GenreTable;
