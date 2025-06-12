import Review from '../../models/Review';
import ReviewCard from './ReviewCard';
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

interface UpdateReviewProps {
  review: Review;
  onDeleteReview: () => void;
  onUpdateReview: (updatedReview: Review) => void;
}

const UpdateReview: React.FC<UpdateReviewProps> = ({ review, onDeleteReview, onUpdateReview }) => {
  const [update, setUpdate] = useState<boolean>(false);
  const [updatedReview, setUpdatedReview] = useState<Review>(review);
  const [validationError, setValidationError] = useState<string | null>();

  const handleMarkChange = (event: React.SyntheticEvent, newMark: number | null) => {
    setUpdatedReview(prev => ({ ...prev, point: newMark ?? 0 }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUpdatedReview({
      ...updatedReview,
      [name]: value,
    });
  };

  const handleDelete = async () => {
    try {
      if (review.id) {
        await ReviewService.delete(review.id);
        toast.success("Review successfully deleted");
      }

      onDeleteReview();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await ReviewService.update(updatedReview)

      toast.success("Review successfully updated");
      setUpdate(false);
      setUpdatedReview(prev => ({ ...prev, likes: 0, dislikes: 0 }));
      onUpdateReview(updatedReview);
    } catch (error: any) {
      setValidationError(error.message);
    }
  };

  return (
    <>
      {update ?
        <Container sx={{ p: 2, backgroundColor: teal[200], borderRadius: '10px' }}>
          {validationError && (
            <Typography color='error' sx={{ mb: 1, textAlign: 'center' }}>
              • {validationError}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex" }}>
            <TextField
              label="Review Text"
              name="text"
              value={updatedReview.text}
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
                  value={updatedReview.point}
                  onChange={handleMarkChange}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button sx={{ ml: 1 }}
                  type="submit"
                  variant="contained"
                >
                  Submit
                </Button>

                <Button sx={{ ml: 1 }}
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setUpdatedReview(review);
                    setUpdate(false);
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
        :
        <>
          <ReviewCard review={updatedReview} />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
            >
              Delete
            </Button>

            <Button
              variant="contained"
              sx={{ ml: 1 }}
              onClick={() => setUpdate(true)}
            >
              Edit
            </Button>
          </Box>
        </>
      }
    </>
  );
}

export default UpdateReview;
