using Reviews.Core.DTO.Filters;
using Reviews.Core.DTO;
using Reviews.Core.Models;

namespace Reviews.Application.Services.Interfaces
{
	public interface IReviewService
	{
		Task<PartialData<Review>> GetFilteredListAsync(ReviewFilter filter);
		Task<Review?> GetForMovieAndUserAsync(Guid movieId, Guid userId);
		Task<Review> GetByIdAsync(Guid id);
		Task<double?> GetReviewersRatingAsync(Guid movieId);
		Task<int> GetCountAsync(Guid movieId);
		Task CreateAsync(Review review);
		Task UpdateAsync(Review review);
		Task DeleteAsync(Review review);
	}
}
