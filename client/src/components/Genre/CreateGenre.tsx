import GenreService from '../../services/GenreService';
import toast from 'react-hot-toast';
import { blue, teal } from '@mui/material/colors';
import {
  Box,
  BoxProps,
  Button,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';

interface CreateGenreProps extends BoxProps {
  onCreate: () => void;
}

const CreateGenre: React.FC<CreateGenreProps> = ({ onCreate, ...props }) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [genreName, setGenreName] = useState<string>("");

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleGenreCreate = async () => {
    if (genreName.length === 0) {
      setIsError(true);
      return;
    }

    const genre = {
      name: genreName
    };

    try {
      await GenreService.create(genre);
      setGenreName("");
      setIsError(false);
      setValidationError(null);
      onCreate();
      toast.success("Genre successfully created");
    } catch (error: any) {
      setValidationError(error.message);
    }
  };

  return (
    <Box
      {...props}
      sx={{ ...props.sx, p: 1, backgroundColor: teal[100] }}
    >
      {validationError && (
        <Typography color='error' sx={{ mb: 2, textAlign: 'center' }}>
          • {validationError}
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          error={isError}
          label={isError ? "Genre Name Required" : "Genre Name"}
          name="genreName"
          value={genreName}
          onChange={(e) => setGenreName(e.target.value)}
          slotProps={{
            input: {
              sx: { backgroundColor: blue[50] }
            }
          }}
        />

        <Button variant="contained" onClick={handleGenreCreate}>
          Create Genre
        </Button>
      </Box>
    </Box>
  );
}

export default CreateGenre;
