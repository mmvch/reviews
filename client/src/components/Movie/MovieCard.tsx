import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Movie from '../../models/Movie';
import Typography from '@mui/material/Typography';
import {
  Box,
  CardActionArea,
  CardMedia,
  CircularProgress
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(`${process.env.REACT_APP_SERVER_IMAGES_URL}/default_movie_poster.png`);

  useEffect(() => {
    if (movie.posterFileName) {
      const imageUrl = `${process.env.REACT_APP_SERVER_IMAGES_URL}/${movie.posterFileName}`;
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setImageSrc(imageUrl);
      };
    }
  }, [movie.posterFileName]);

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/movies/${movie.id}`)}>
        {movie.score &&
          <Box position="absolute" display="inline-flex" top={10} right={10}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 25
            }}>
            <CircularProgress
              variant="determinate"
              color='success'
              value={movie.score}
              size={50}
              thickness={8}
            />
            <Box
              height={1}
              width={1}
              position="absolute"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography style={{ fontWeight: 'bold', fontSize: 24, color: 'white' }}>
                {`${movie.score}`}
              </Typography>
            </Box>
          </Box>}

        <CardMedia
          component='img'
          image={imageSrc}
        />
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 3 }}
          >
            {movie.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'right' }}
          >
            {movie.releaseDate && (new Date(movie.releaseDate)).getFullYear()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default MovieCard;
