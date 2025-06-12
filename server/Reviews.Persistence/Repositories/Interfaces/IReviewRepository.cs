using Reviews.Core.DTO;
using Reviews.Core.Models;
using System.Linq.Expressions;

namespace Reviews.Persistence.Repositories.Interfaces
{
	public interface IReviewRepository : IRepository<Review, Guid>
	{
		Task<PartialData<Review>> GetFilteredListAsync(Expression<Func<Review, bool>>? predicate = null,
			int? skip = null, int? take = null, params Expression<Func<Review, object?>>[] includes);
		Task<Dictionary<Guid, SimpleReview[]>> GetSimpledStacksAsync(Expression<Func<Movie, bool>>? predicate = null);
		Task<Review?> GetAsync(Guid movieId, Guid userId);
		Task<Review?> GetAsync(Guid movieId, Guid userId, params Expression<Func<Review, object?>>[] includes);
		Task<int> GetCountAsync(Guid movieId);
		Task<double?> GetAveragePointAsync(Guid movieId);
	}
}
