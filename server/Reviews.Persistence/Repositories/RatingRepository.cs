using Microsoft.EntityFrameworkCore;
using Reviews.Core.Constants;
using Reviews.Core.DTO;
using Reviews.Core.Models;
using Reviews.Persistence.Contexts;
using Reviews.Persistence.Repositories.Interfaces;
using System.Linq.Expressions;

namespace Reviews.Persistence.Repositories
{
	public class RatingRepository(Context context) : Repository<Rating, Guid>(context), IRatingRepository
	{
		public async Task<Dictionary<Guid, SimpleRating[]>> GetRelatedRatingsAsync(Guid userId)
		{
			var movieIds = _context.Movies.AsNoTracking()
				.Where(m => m.Ratings!.Any(r => r.UserId == userId))
				.Select(m => m.Id);

			return await _dbSet.AsNoTracking()
				.Where(r => movieIds.Contains(r.MovieId))
				.GroupBy(r => r.UserId)
				.ToDictionaryAsync(
					g => g.Key,
					g => g.Select(r => new SimpleRating
					{
						Point = r.Point,
						MovieId = r.MovieId
					}).ToArray()
				);
		}

		public async Task<Dictionary<Guid, SimpleRating[]>> GetUnrelatedRatingsAsync(Guid userId, Expression<Func<Movie, bool>>? predicate = null)
		{
			var query = _context.Movies.AsNoTracking();

			if (predicate != null)
			{
				query = query.Where(predicate);
			}

			var userIds = _context.Movies.AsNoTracking()
				.Where(m => m.Ratings!.Any(r => r.UserId == userId))
				.SelectMany(m => m.Ratings!)
				.Select(r => r.UserId)
				.Distinct();

			var movieIds = query
				.Where(m => m.Ratings!.All(r => r.UserId != userId))
				.Select(m => m.Id);

			var res = await _dbSet.AsNoTracking()
				.Where(r => userIds.Contains(r.UserId) && movieIds.Contains(r.MovieId))
				.GroupBy(r => r.UserId)
				.ToDictionaryAsync(
					g => g.Key,
					g => g.Select(r => new SimpleRating
					{
						Point = r.Point,
						MovieId = r.MovieId
					}).ToArray()
				);

			return res;
		}

		public async Task<SimpleRating[]> GetForUserAsync(Guid userId)
		{
			return await _dbSet.AsNoTracking()
				.Where(r => r.UserId == userId)
				.Select(r => new SimpleRating
				{
					Point = r.Point,
					MovieId = r.MovieId
				})
				.ToArrayAsync();
		}

		public async Task<Rating?> GetForUserAsync(Guid movieId, Guid userId)
		{
			return await _dbSet.AsNoTracking().FirstOrDefaultAsync(r => r.MovieId == movieId && r.UserId == userId);
		}

		public async Task<double?> GetAverageAsync(Guid movieId)
		{
			IQueryable<Rating> query = _dbSet.AsNoTracking()
				.Where(rating => rating.MovieId == movieId && rating.User!.Role!.Name == AppRoles.Rater);

			return await query.AnyAsync() ? await query.AverageAsync(rating => rating.Point) : null;
		}

		public async Task<int> GetCountAsync(Guid movieId)
		{
			return await _dbSet.AsNoTracking().Where(r => r.MovieId == movieId && r.User!.Role!.Name == AppRoles.Rater).CountAsync();
		}
	}
}
