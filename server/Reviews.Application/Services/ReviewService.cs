using Reviews.Application.Services.Interfaces;
using Reviews.Core.DTO;
using Reviews.Core.DTO.Filters;
using Reviews.Core.Exceptions;
using Reviews.Core.Extensions;
using Reviews.Core.Models;
using Reviews.Persistence.Repositories.Interfaces;
using System.Net;

namespace Reviews.Application.Services
{
	public class ReviewService : IReviewService
	{
		private readonly IReviewRepository _reviewRepository;
		private readonly IMovieRepository _movieRepository;
		private readonly IReactionRepository _reactionRepository;

		public ReviewService(IReviewRepository reviewRepository, IMovieRepository movieRepository, IReactionRepository reactionRepository)
		{
			_reviewRepository = reviewRepository;
			_movieRepository = movieRepository;
			_reactionRepository = reactionRepository;
		}

		public async Task<PartialData<Review>> GetFilteredListAsync(ReviewFilter filter)
		{
			return await _reviewRepository.GetFilteredListAsync(
				filter.GetPredicate(),
				filter.CurrentPage * filter.PageSize,
				filter.PageSize,
				review => review.User, review => review.Reactions
			);
		}

		public async Task<Review?> GetForMovieAndUserAsync(Guid movieId, Guid userId)
		{
			return await _reviewRepository.GetAsync(movieId, userId, review => review.Reactions);
		}

		public async Task<Review> GetByIdAsync(Guid id)
		{
			return await _reviewRepository.GetByIdAsync(id) ??
				throw new ServiceException("Review not found", HttpStatusCode.NotFound);
		}

		public async Task<double?> GetReviewersRatingAsync(Guid movieId)
		{
			_ = await _movieRepository.GetByIdAsync(movieId)
				?? throw new ServiceException("Movie not found", HttpStatusCode.NotFound);

			return await _reviewRepository.GetAveragePointAsync(movieId);
		}

		public async Task<int> GetCountAsync(Guid movieId)
		{
			return await _reviewRepository.GetCountAsync(movieId);
		}

		public async Task CreateAsync(Review review)
		{
			_ = await _movieRepository.GetByIdAsync(review.MovieId)
					?? throw new ServiceException("Movie not found", HttpStatusCode.NotFound);

			if (await _reviewRepository.GetAsync(review.MovieId, review.UserId) != null)
			{
				throw new ServiceException("You can create only one review for movie", HttpStatusCode.Conflict);
			}

			if (review.Point < 1 || review.Point > 5)
			{
				throw new ServiceException("Point must be between 1 and 5", HttpStatusCode.BadRequest);
			}

			await _reviewRepository.CreateAsync(review);
		}

		public async Task UpdateAsync(Review review)
		{
			if (review.Point < 1 || review.Point > 5)
			{
				throw new ServiceException("Point must be between 1 and 5", HttpStatusCode.BadRequest);
			}

			await _reviewRepository.UpdateAsync(review);
			await _reactionRepository.DeleteRangeAsync(reviewReaction => reviewReaction.ReviewId == review.Id);
		}

		public async Task DeleteAsync(Review review)
		{
			await _reviewRepository.DeleteAsync(review);
		}
	}
}
