using Reviews.Core.Models;

namespace Reviews.Application.Services.Interfaces
{
	public interface IRatingService
	{
		Task<Rating?> GetForUserAsync(Guid movieId, Guid userId);
		Task<int> GetCountAsync(Guid movieId);
		Task<double?> GetRatersRatingAsync(Guid movieId);
		Task CreateAsync(Rating rating);
		Task UpdateAsync(Rating rating);
		Task DeleteAsync(Guid movieId, Guid userId);
	}
}
