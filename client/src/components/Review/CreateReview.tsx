import Review from '../../models/Review';
import ReviewService from '../../services/ReviewService';
import toast from 'react-hot-toast';
import { blue, teal } from '@mui/material/colors';
import {
  Box,
  Button,
  Container,
  FormLabel,
  Rating,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';

interface CreateReviewProps {
  movieId: string;
  onCreateReview: (newReview: Review) => void;
}

const CreateReview: React.FC<CreateReviewProps> = ({ movieId, onCreateReview }) => {
  const [review, setReview] = useState<Review>({
    text: "",
    point: 0,
    movieId: movieId
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleMarkChange = (event: React.SyntheticEvent, newMark: number | null) => {
    setReview(prev => ({ ...prev, point: newMark ?? 0 }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setReview({
      ...review,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const newReview = await ReviewService.create(review);
      toast.success("Review successfully created");
      onCreateReview(newReview);
    } catch (error: any) {
      setValidationError(error.message);
    }
  };

  return (
    <Container sx={{ p: 2, backgroundColor: teal[200], borderRadius: 2 }}>
      {validationError && (
        <Typography color='error' sx={{ mb: 1, textAlign: 'center' }}>
          • {validationError}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex" }}>
        <TextField
          label="Review Text"
          name="text"
          value={review.text}
          onChange={handleChange}
          required
          fullWidth
          multiline
          minRows={7}
          maxRows={16}
          slotProps={{
            input: {
              sx: { backgroundColor: blue[50] }
            }
          }}
        />

        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 0.4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <FormLabel>Movie Rating</FormLabel>
            <Rating
              name="mark"
              value={review.point}
              onChange={handleMarkChange}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Button sx={{ m: 1 }}
              type="submit"
              variant="contained"
            >
              Create Review
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default CreateReview;
