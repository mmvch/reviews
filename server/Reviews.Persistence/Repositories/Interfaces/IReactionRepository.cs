using Reviews.Core.DTO;
using Reviews.Core.Models;
using System.Linq.Expressions;

namespace Reviews.Persistence.Repositories.Interfaces
{
	public interface IReactionRepository : IRepository<ReviewReaction, Guid>
	{
		Task<Dictionary<Guid, SimpleReaction[]>> GetRelatedReactionsAsync(Guid userId);
		Task<SimpleReaction[]> GetForUserAsync(Guid userId);
		Task<ReviewReaction?> GetAsync(Guid reviewId, Guid userId);
		Task DeleteRangeAsync(Expression<Func<ReviewReaction, bool>> predicate);
	}
}
