import Loader from '../Loader';
import React, { ElementType, useEffect, useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import toast from 'react-hot-toast';
import { Box, SvgIconProps, Typography } from '@mui/material';
import { formatNumber } from '../../utils/utils';
import { teal } from '@mui/material/colors';

interface RatingCardProps {
  Icon: ElementType<SvgIconProps>;
  movieId: string;
  getAverageRating(movieId: string): Promise<number | null>;
  getCount(movieId: string): Promise<number>;
}

const RatingCard: React.FC<RatingCardProps> = ({ Icon, movieId, getAverageRating, getCount }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number>(0);

  useEffect(() => {
    const fetchRatings = async (movieId: string) => {
      try {
        const averageResponse = await getAverageRating(movieId);
        setRating(averageResponse);

        const countResponse = await getCount(movieId);
        setRatingCount(countResponse);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings(movieId);
  }, [movieId, getAverageRating, getCount]);

  return (
    <Box sx={{ p: 1, display: 'flex', alignItems: 'center', backgroundColor: teal[200], borderRadius: 8 }}>
      <Icon color='action' sx={{ fontSize: 56 }} />
      {isLoading ? (
        <Loader />
      ) : (
        typeof rating === 'number' ? (
          <Box sx={{ ml: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h4" color='white' sx={{ textAlign: 'center' }}>
                {rating.toFixed(1)}
              </Typography>

              <StarIcon color='warning' sx={{ fontSize: 24 }} />
            </Box>

            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              {formatNumber(ratingCount)}
            </Typography>
          </Box>
        ) : (
          <Typography variant="h4" color='white' sx={{ ml: 1, textAlign: 'center' }}>
            Unrated
          </Typography>
        )
      )}
    </Box>
  );
};

export default RatingCard;
