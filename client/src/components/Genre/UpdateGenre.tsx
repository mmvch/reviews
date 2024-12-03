import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Genre from '../../models/Genre';
import GenreService from '../../services/GenreService';
import toast from 'react-hot-toast';
import { blue } from '@mui/material/colors';
import {
  Box,
  IconButton,
  TableCell,
  TableRow,
  TextField
} from '@mui/material';
import { useEffect, useState } from 'react';

interface UpdateGenreProps {
  genre: Genre;
  onUpdate: (genre: Genre | null) => void;
}

const UpdateGenre: React.FC<UpdateGenreProps> = ({ genre, onUpdate }) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [updatedGenre, setUpdatedGenre] = useState<Genre>(genre);

  useEffect(() => {
    setUpdatedGenre(genre);
  }, [genre]);

  const handleUpdateConfirm = async () => {
    if (updatedGenre.name?.length === 0) {
      setIsError(true);
      return;
    } else if (updatedGenre.name !== genre.name) {
      try {
        await GenreService.update(updatedGenre);
        toast.success("Genre successfully updated");
        onUpdate(updatedGenre);
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const handleCancelClick = () => {
    onUpdate(null);
  }

  return (
    <TableRow key={updatedGenre.id}>
      <TableCell sx={{ p: 0.77 }}>
        <TextField
          size='small'
          error={isError}
          label={isError ? "Genre Name Required" : "Genre Name"}
          name="genreName"
          value={updatedGenre.name}
          onChange={(e) => setUpdatedGenre(prev => ({ ...prev, name: e.target.value }))}
          slotProps={{
            input: {
              sx: { backgroundColor: blue[50] }
            }
          }}
        />
      </TableCell>
      <TableCell padding='none'>
        <Box sx={{ marginInline: 2, display: "flex", justifyContent: 'end' }}>
          <IconButton onClick={() => handleUpdateConfirm()} disabled={updatedGenre.name === genre.name}>
            <CheckCircleIcon />
          </IconButton>
          <IconButton onClick={() => handleCancelClick()}>
            <CancelIcon />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
}

export default UpdateGenre;
