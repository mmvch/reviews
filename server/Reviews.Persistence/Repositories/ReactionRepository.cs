using Microsoft.EntityFrameworkCore;
using Reviews.Core.DTO;
using Reviews.Core.Models;
using Reviews.Persistence.Contexts;
using Reviews.Persistence.Repositories.Interfaces;
using System.Linq.Expressions;

namespace Reviews.Persistence.Repositories
{
	public class ReactionRepository(Context context) : Repository<ReviewReaction, Guid>(context), IReactionRepository
	{
		public async Task<Dictionary<Guid, SimpleReaction[]>> GetRelatedReactionsAsync(Guid userId)
		{
			var reviewIds = _context.Reviews.AsNoTracking()
				.Where(r => r.Reactions!.Any(rr => rr.UserId == userId))
				.Select(r => r.Id);

			return await _dbSet.AsNoTracking()
				.Where(rr => reviewIds.Contains(rr.ReviewId))
				.GroupBy(rr => rr.UserId)
				.ToDictionaryAsync(
					g => g.Key,
					g => g.Select(rr => new SimpleReaction
					{
						IsLiked = rr.IsLiked,
						ReviewId = rr.ReviewId
					}).ToArray()
				);
		}

		public async Task<SimpleReaction[]> GetForUserAsync(Guid userId)
		{
			return await _dbSet.AsNoTracking()
				.Where(r => r.UserId == userId)
				.Select(r => new SimpleReaction
				{
					IsLiked = r.IsLiked,
					ReviewId = r.ReviewId
				})
				.ToArrayAsync();
		}

		public async Task<ReviewReaction?> GetAsync(Guid reviewId, Guid userId)
		{
			return await _dbSet.FirstOrDefaultAsync(ur => ur.ReviewId == reviewId && ur.UserId == userId);
		}

		public async Task DeleteRangeAsync(Expression<Func<ReviewReaction, bool>> predicate)
		{
			IEnumerable<ReviewReaction> reactions = await _dbSet.Where(predicate).ToListAsync();
			await DeleteRangeAsync(reactions);
		}
	}
}
