import CreateReview from './CreateReview';
import Review from '../../models/Review';
import ReviewService from '../../services/ReviewService';
import toast from 'react-hot-toast';
import UpdateReview from './UpdateReview';
import { useEffect, useState } from 'react';

interface OwnReviewProps {
  movieId: string;
  onChange: () => void;
}

const OwnReview: React.FC<OwnReviewProps> = ({ movieId, onChange }) => {
  const [userReview, setUserReview] = useState<Review | null>(null);

  const handleReviewChange = (newReview: Review) => {
    setUserReview(newReview);
    onChange();
  };

  const handleReviewDelete = () => {
    setUserReview(null);
    onChange();
  };

  useEffect(() => {
    const fetchUserReview = async () => {
      try {
        const response = await ReviewService.getForCurrentUserAndMovie(movieId);
        setUserReview(response);
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    fetchUserReview();
  }, [movieId]);

  return (<>
    {userReview ? (
      <UpdateReview
        review={userReview}
        onDeleteReview={handleReviewDelete}
        onUpdateReview={handleReviewChange}
      />
    ) : (
      <CreateReview
        movieId={movieId}
        onCreateReview={handleReviewChange}
      />
    )}
  </>);
}

export default OwnReview;
