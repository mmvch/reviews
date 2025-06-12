import ReactionService from '../../services/ReactionService';
import Review from '../../models/Review';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import toast from 'react-hot-toast';
import Typography from '@mui/material/Typography';
import useUser from '../../contexts/user-context/useUser';
import { blue } from '@mui/material/colors';
import {
  Box,
  Radio,
  RadioGroup,
  Rating
} from '@mui/material';
import { formatNumber } from '../../utils/utils';
import { useEffect, useState } from 'react';

interface ReviewCardProps {
  review: Review;
}

type SetStateFunction = (value: React.SetStateAction<number>) => void;

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { isAuth } = useUser();

  const [liked, setLiked] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState<number>(review.likes ?? 0);
  const [dislikeCount, setDislikeCount] = useState<number>(review.dislikes ?? 0);

  useEffect(() => {
    if (!isAuth) {
      setLiked(null);
      return;
    }

    const fetchReaction = async (reviewId: string) => {
      try {
        const response = await ReactionService.getForReview(reviewId);
        setLiked(response.isLiked ?? null);
      } catch (error: any) {
        toast.error(error.message);
      }
    }

    if (review.id) {
      fetchReaction(review.id);
    }
  }, [review.id, isAuth]);

  const updateReviewReactions = () => {
    setLikeCount(prev => {
      review.likes = prev;
      return prev;
    });

    setDislikeCount(prev => {
      review.dislikes = prev;
      return prev;
    });
  }

  const handleDislikeClick = () => {
    handleChange(false, setDislikeCount, setLikeCount);
  };

  const handleLikeClick = () => {
    handleChange(true, setLikeCount, setDislikeCount);
  };

  const handleChange = async (newValue: boolean, updateCount: SetStateFunction, updateOtherCount: SetStateFunction) => {
    if (!review.id || !isAuth) {
      return;
    }

    try {
      if (liked === newValue) {
        await ReactionService.delete(review.id);
        updateCount(prev => prev - 1);
        setLiked(null);
      } else {
        if (liked !== null) {
          await ReactionService.update({ reviewId: review.id, isLiked: newValue });
          updateOtherCount(prev => prev - 1);
        } else {
          await ReactionService.create({ reviewId: review.id, isLiked: newValue });
        }

        updateCount(prev => prev + 1);
        setLiked(newValue);
      }

      updateReviewReactions();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", backgroundColor: blue[50], borderRadius: 2 }}>
      <Box sx={{ mr: 2, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="h6">
            {review.user?.name ?? "Unknown"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {review.creationDate?.split("T")[0]}
          </Typography>
        </Box>

        <Typography variant="body2">
          {review.text}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box sx={{ mb: 1, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Movie Rating
          </Typography>
          <Rating name="disabled" value={review.point} readOnly />
        </Box>

        <RadioGroup row>
          <Radio
            disabled={!isAuth}
            checked={liked === true}
            onClick={handleLikeClick}
            icon={<ThumbUpOutlinedIcon />}
            checkedIcon={<ThumbUpIcon color="action" />}
          />

          <Typography variant="body1" color="text.secondary" alignContent="center" sx={{ mr: 1 }}>
            {formatNumber(likeCount)}
          </Typography>

          <Radio
            disabled={!isAuth}
            checked={liked === false}
            onClick={handleDislikeClick}
            icon={<ThumbDownOutlinedIcon />}
            checkedIcon={<ThumbDownIcon color="action" />}
          />

          <Typography variant="body1" color="text.secondary" alignContent="center">
            {formatNumber(dislikeCount)}
          </Typography>
        </RadioGroup>
      </Box>
    </Box>
  );
}

export default ReviewCard;
