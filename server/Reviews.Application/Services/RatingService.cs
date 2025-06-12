using Reviews.Application.Services.Interfaces;
using Reviews.Core.Exceptions;
using Reviews.Core.Models;
using Reviews.Persistence.Repositories.Interfaces;
using System.Net;

namespace Reviews.Application.Services
{
	public class RatingService : IRatingService
	{
		private readonly IRatingRepository _ratingRepository;
		private readonly IMovieRepository _movieRepository;

		public RatingService(IRatingRepository ratingRepository, IMovieRepository movieRepository)
		{
			_ratingRepository = ratingRepository;
			_movieRepository = movieRepository;
		}

		public async Task<Rating?> GetForUserAsync(Guid movieId, Guid userId)
		{
			return await _ratingRepository.GetForUserAsync(movieId, userId);
		}

		public async Task<int> GetCountAsync(Guid movieId)
		{
			return await _ratingRepository.GetCountAsync(movieId);
		}

		public async Task<double?> GetRatersRatingAsync(Guid movieId)
		{
			_ = await _movieRepository.GetByIdAsync(movieId)
				?? throw new ServiceException("Movie not found", HttpStatusCode.NotFound);

			return await _ratingRepository.GetAverageAsync(movieId);
		}

		public async Task CreateAsync(Rating rating)
		{
			_ = await _movieRepository.GetByIdAsync(rating.MovieId)
				?? throw new ServiceException("Movie not found", HttpStatusCode.NotFound);

			if (await _ratingRepository.GetForUserAsync(rating.MovieId, rating.UserId) != null)
			{
				throw new ServiceException("You can rate this movie only once", HttpStatusCode.Conflict);
			}

			if (rating.Point < 1 || rating.Point > 5)
			{
				throw new ServiceException("Point must be between 1 and 5", HttpStatusCode.BadRequest);
			}

			await _ratingRepository.CreateAsync(rating);
		}

		public async Task UpdateAsync(Rating rating)
		{
			_ = await _movieRepository.GetByIdAsync(rating.MovieId)
				?? throw new ServiceException("Movie not found", HttpStatusCode.NotFound);

			_ = await _ratingRepository.GetForUserAsync(rating.MovieId, rating.UserId)
				?? throw new ServiceException("Rating not found", HttpStatusCode.NotFound);

			if (rating.Point < 1 || rating.Point > 5)
			{
				throw new ServiceException("Point must be between 1 and 5", HttpStatusCode.BadRequest);
			}

			await _ratingRepository.UpdateAsync(rating);
		}

		public async Task DeleteAsync(Guid movieId, Guid userId)
		{
			Rating rating = await _ratingRepository.GetForUserAsync(movieId, userId)
				?? throw new ServiceException("The user has not rated this movie", HttpStatusCode.NotFound);

			await _ratingRepository.DeleteAsync(rating);
		}
	}
}
