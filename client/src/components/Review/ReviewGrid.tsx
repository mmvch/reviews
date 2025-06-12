import Loader from '../Loader';
import Review from '../../models/Review';
import ReviewCard from './ReviewCard';
import ReviewFilter from '../../models/filters/ReviewFilter';
import ReviewService from '../../services/ReviewService';
import toast from 'react-hot-toast';
import {
  Box,
  Pagination,
  PaginationItem,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

interface ReviewGridProps {
  movieId: string;
}

const ReviewGrid: React.FC<ReviewGridProps> = ({ movieId }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const [filter, setFilter] = useState<ReviewFilter>({
    movieId: movieId,
    currentPage: 0,
    pageSize: 12
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await ReviewService.getFilteredList(filter);
        setReviews(response.data ?? []);
        setTotalAmount(response.totalAmount ?? 0);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [filter]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    window.scrollTo(0, 0);
    setFilter(prev => ({
      ...prev,
      currentPage: newPage - 1
    }));
  };

  return (
    <>
      {isLoading ? (
        <Loader size={80} thickness={6} />
      ) : (
        <>
          {totalAmount !== 0 ? (
            <>
              {reviews.map((review) => (
                <Box key={review.id} sx={{ mb: 2 }}>
                  <ReviewCard review={review} />
                </Box>
              ))}

              {Math.floor(totalAmount / (filter.pageSize ?? 10)) > 0 && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Pagination
                    count={Math.ceil(totalAmount / (filter.pageSize ?? 10))}
                    page={(filter?.currentPage ?? 0) + 1}
                    onChange={handlePageChange}
                    renderItem={(item) => (
                      <PaginationItem
                        {...item}
                        disabled={
                          item.type === 'page'
                            ? item.page === (filter?.currentPage ?? 0) + 1
                            : item.disabled
                        }
                      />
                    )}
                  />
                </Box>
              )}
            </>
          ) : (
            <Typography variant="h6" textAlign="center" color='info'>
              No reviews yet
            </Typography>
          )}
        </>
      )}
    </>
  );
}

export default ReviewGrid;
