using Reviews.Core.DTO;
using Reviews.Core.Models;
using System.Linq.Expressions;

namespace Reviews.Persistence.Repositories.Interfaces
{
	public interface IRatingRepository : IRepository<Rating, Guid>
	{
		Task<Dictionary<Guid, SimpleRating[]>> GetRelatedRatingsAsync(Guid userId);
		Task<Dictionary<Guid, SimpleRating[]>> GetUnrelatedRatingsAsync(Guid userId, Expression<Func<Movie, bool>>? predicate = null);
		Task<SimpleRating[]> GetForUserAsync(Guid userId);
		Task<Rating?> GetForUserAsync(Guid movieId, Guid userId);
		Task<double?> GetAverageAsync(Guid movieId);
		Task<int> GetCountAsync(Guid movieId);
	}
}
