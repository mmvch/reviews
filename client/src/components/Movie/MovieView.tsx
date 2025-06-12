import EngineeringIcon from '@mui/icons-material/Engineering';
import Movie from '../../models/Movie';
import MovieRating from '../../models/MovieRating';
import MovieService from '../../services/MovieService';
import RatingCard from '../Stats/RatingCard';
import RatingService from '../../services/RatingService';
import ReviewService from '../../services/ReviewService';
import ReviewTab from '../Review/ReviewTab';
import SchoolIcon from '@mui/icons-material/School';
import toast from 'react-hot-toast';
import useUser from '../../contexts/user-context/useUser';
import { AppRoles } from '../../utils/AppRoles';
import {
  Box,
  Button,
  Chip,
  Container,
  Rating,
  Typography
} from '@mui/material';
import { teal } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MovieView: React.FC = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const { id } = useParams<{ id: string }>();

  const [movie, setMovie] = useState<Movie>(new Movie());
  const [rating, setRating] = useState<MovieRating | null>(null);

  const [reRenderRatersRating, setReRenderRatersRating] = useState(false);
  const [reRenderReviewersRating, setReRenderReviewersRating] = useState(false);

  useEffect(() => {
    const fetchMovie = async (movieId: string) => {
      try {
        const response = await MovieService.getById(movieId);
        setMovie({ ...response, releaseDate: response.releaseDate?.split("T")[0] });
      } catch (error: any) {
        navigate('/movies');
        toast.error(error.message);
      }
    };

    if (id) {
      fetchMovie(id);
    } else {
      navigate('/movies');
    }
  }, [id, navigate]);

  useEffect(() => {
    const fetchUserRating = async (movieId: string) => {
      try {
        const response = await RatingService.getForMovieAndCurrentUser(movieId);
        setRating(response);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    if (id && user?.role === AppRoles.Rater) {
      fetchUserRating(id)
    }
  }, [id, user]);

  const handleReviewsChange = () => {
    setReRenderReviewersRating(prev => !prev);
  }

  const handleRatingChange = async (event: React.SyntheticEvent, newMark: number | null) => {
    if (!id) return;

    try {
      if (newMark) {
        if (rating) {
          await RatingService.update({ ...rating, point: newMark });
        } else {
          await RatingService.create({ movieId: id, point: newMark });
        }

        setRating(prev => ({ ...prev, point: newMark }));
      } else {
        await RatingService.delete(id);
        setRating(null);
      }

      setReRenderRatersRating(prev => !prev);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!id) {
    return null;
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mb: 1, backgroundColor: teal[100], borderRadius: 2 }}>
      <Box sx={{ display: "flex", paddingBlock: 3 }}>
        <Box
          component="img"
          src={movie.posterFileName ?
            `${process.env.REACT_APP_SERVER_IMAGES_URL}/${movie.posterFileName}` :
            `${process.env.REACT_APP_SERVER_IMAGES_URL}/default_movie_poster.png`}
          alt="Poster"
          sx={{ width: 300, height: 450, objectFit: 'fill' }}
        />

        <Box sx={{ ml: 4, display: 'flex', flexDirection: "column", justifyContent: 'space-between', width: 1 }}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">
                {movie.name}
              </Typography>

              {user?.role === AppRoles.Rater &&
                <Rating name="mark" value={rating?.point ?? null} onChange={handleRatingChange} />
              }
            </Box>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {movie.description}
            </Typography>

            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ alignContent: "center" }}>
                Release Date: {movie.releaseDate}
              </Typography>

              {user?.role === AppRoles.Admin &&
                <Button variant="contained" onClick={() => navigate(`/movies/update/${id}`)}>
                  Edit Movie
                </Button>
              }
            </Box>

            {movie.genres && movie.genres.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {movie.genres.map((genre) => (
                  <Chip key={genre.id} label={genre.name} />
                ))}
              </Box>
            )}
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-evenly' }}>
            <RatingCard
              key={`raters-${reRenderRatersRating ? 'rendered' : 'not-rendered'}`}
              Icon={EngineeringIcon}
              movieId={id}
              getAverageRating={RatingService.getAverageRating}
              getCount={RatingService.getCount} />
            <RatingCard
              key={`reviewers-${reRenderReviewersRating ? 'rendered' : 'not-rendered'}`}
              Icon={SchoolIcon}
              movieId={id}
              getAverageRating={ReviewService.getAverageRating}
              getCount={ReviewService.getCount} />
          </Box>
        </Box>
      </Box>
      <ReviewTab movieId={id} onChange={handleReviewsChange} />
    </Container>
  );
}

export default MovieView;
