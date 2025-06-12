import Genre from '../../models/Genre';
import GenreService from '../../services/GenreService';
import Grid from '@mui/material/Grid2';
import Movie from '../../models/Movie';
import MovieService from '../../services/MovieService';
import toast from 'react-hot-toast';
import {
  Autocomplete,
  Box,
  Button,
  Container,
  TextField,
  Typography
} from '@mui/material';
import { blue, teal } from '@mui/material/colors';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateMovie: React.FC = () => {
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie>({
    name: "",
    description: "",
    releaseDate: "",
    genres: []
  });

  const [genres, setGenres] = useState<Genre[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMovie({
      ...movie,
      [name]: value,
    });
  };

  const handleGenreChange = (event: React.SyntheticEvent, value: Genre[]) => {
    setMovie({ ...movie, genres: value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const validImageTypes = ["image/jpeg", "image/png", "image/bmp"];

      if (validImageTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setImageUrl(URL.createObjectURL(selectedFile));
        setValidationError(null);
      } else {
        setValidationError("Please upload a valid image file (.jpeg, .png, .bmp).");
        setFile(null);
        setImageUrl(null);
      }
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setImageUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (!file) {
        throw new Error("Movie poster is required");
      }

      const formData = new FormData();
      formData.append("name", movie.name ?? "");
      formData.append("description", movie.description ?? "");
      formData.append("releaseDate", movie.releaseDate ?? "");

      movie.genres?.forEach(genre => {
        formData.append("genres", genre.id ?? "")
      })

      formData.append("image", file);

      const movieId = await MovieService.create(formData);
      toast.success("Movie successfully created");
      navigate(`/movies/${movieId}`);
    } catch (error: any) {
      setValidationError(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="md" disableGutters sx={{ backgroundColor: teal[100], borderRadius: 2 }}>
      <Box sx={{ pt: 1 }}>
        {validationError && (
          <Typography color='error' sx={{ marginBlock: 1, textAlign: 'center' }}>
            • {validationError}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex" }}>
          <Grid container justifyContent="center" sx={{ p: 3 }} size={5}>
            {imageUrl && (
              <Box
                component="img"
                src={imageUrl}
                alt="Selected Preview"
                sx={{ width: 300, height: 450, objectFit: 'fill', mb: 2 }}
              />
            )}

            <Grid sx={{ mt: 'auto' }}>
              <Button
                variant="contained"
                component="label"
                sx={{ m: 1 }}
              >
                Upload Image
                <input
                  type="file"
                  accept=".png, .jpeg, .bmp"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </Button>

              <Button
                variant="contained"
                onClick={handleFileRemove}
                disabled={!imageUrl}
                sx={{ m: 1 }}
              >
                Remove Image
              </Button>
            </Grid>
          </Grid>

          <Grid container justifyContent="center" sx={{ p: 3 }} size={7}>
            <TextField
              label="Movie Name"
              name="name"
              value={movie.name}
              onChange={handleChange}
              required
              fullWidth
              slotProps={{
                input: {
                  sx: { backgroundColor: blue[50] }
                }
              }}
              sx={{ mb: 4 }}
            />

            <TextField
              label="Description"
              name="description"
              value={movie.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={6}
              slotProps={{
                input: {
                  sx: { backgroundColor: blue[50] }
                }
              }}
              sx={{ mb: 4 }}
            />

            <Autocomplete
              multiple
              options={genres}
              getOptionLabel={(option) => option.name || ""}
              value={movie.genres}
              onChange={handleGenreChange}
              fullWidth
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
                />)}
              sx={{ mb: 4 }}
            />

            <TextField
              label="Select Release Date"
              type="date"
              name="releaseDate"
              value={movie.releaseDate}
              onChange={handleChange}
              required
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true
                },
                input: {
                  sx: { backgroundColor: blue[50] }
                }
              }}
              sx={{ mb: 4 }}
            />

            <Button sx={{ m: 1 }}
              type="submit"
              variant="contained"
            >
              Create Movie
            </Button>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default CreateMovie;
