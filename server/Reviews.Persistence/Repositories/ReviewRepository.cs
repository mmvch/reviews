using Microsoft.EntityFrameworkCore;
using Reviews.Core.Constants;
using Reviews.Core.DTO;
using Reviews.Core.Models;
using Reviews.Persistence.Contexts;
using Reviews.Persistence.Repositories.Interfaces;
using System.Linq.Expressions;

namespace Reviews.Persistence.Repositories
{
	public class ReviewRepository(Context context) : Repository<Review, Guid>(context), IReviewRepository
	{
		public async Task<PartialData<Review>> GetFilteredListAsync(Expression<Func<Review, bool>>? predicate = null,
			int? skip = null, int? take = null, params Expression<Func<Review, object?>>[] includes)
		{
			IQueryable<Review> query = _dbSet.AsNoTracking();

			if (predicate != null)
			{
				query = query.Where(predicate);
			}

			int totalAmount = await query.CountAsync();

			foreach (var include in includes)
			{
				query = query.Include(include);
			}

			query = query
				.OrderByDescending(review => review.Reactions!.Count(rr => rr.IsLiked))
				.Skip(skip ?? 0).Take(take ?? totalAmount);

			return new PartialData<Review>()
			{
				Data = await query.ToListAsync(),
				TotalAmount = totalAmount
			};
		}

		public async Task<Dictionary<Guid, SimpleReview[]>> GetSimpledStacksAsync(Expression<Func<Movie, bool>>? predicate = null)
		{
			var query = _dbSet.AsNoTracking();

			if (predicate != null)
			{
				var movies = _context.Movies.AsNoTracking().Where(predicate);
				query = query.Join(movies, r => r.MovieId, m => m.Id, (r, m) => r);
			}

			return await query
				.GroupJoin(_context.ReviewReactions.AsNoTracking(),
					r => r.Id,
					rr => rr.ReviewId,
					(review, reactions) => new
					{
						review.MovieId,
						review.Point,
						Likes = reactions.Count(rr => rr.IsLiked),
						Dislikes = reactions.Count(rr => !rr.IsLiked)
					})
				.GroupBy(a => a.MovieId)
				.ToDictionaryAsync(
					g => g.Key,
					g => g.Select(r => new SimpleReview
					{
						Point = r.Point,
						Likes = r.Likes,
						Dislikes = r.Dislikes,
					}).ToArray()
			);
		}

		public async Task<Review?> GetAsync(Guid movieId, Guid userId)
		{
			return await _dbSet.AsNoTracking().FirstOrDefaultAsync(r => r.MovieId == movieId && r.UserId == userId);
		}

		public async Task<Review?> GetAsync(Guid movieId, Guid userId, params Expression<Func<Review, object?>>[] includes)
		{
			IQueryable<Review> query = _dbSet.AsNoTracking();

			foreach (var include in includes)
			{
				query = query.Include(include);
			}

			return await query.FirstOrDefaultAsync(r => r.MovieId == movieId && r.UserId == userId);
		}

		public async Task<int> GetCountAsync(Guid movieId)
		{
			return await _dbSet.AsNoTracking().Where(r => r.MovieId == movieId && r.User!.Role!.Name == AppRoles.Reviewer).CountAsync();
		}

		public async Task<double?> GetAveragePointAsync(Guid movieId)
		{
			IQueryable<Review> query = _dbSet.AsNoTracking()
				.Where(review => review.MovieId == movieId && review.User!.Role!.Name == AppRoles.Reviewer);

			return await query.AnyAsync() ? await query.AverageAsync(review => review.Point) : null;
		}
	}
}
