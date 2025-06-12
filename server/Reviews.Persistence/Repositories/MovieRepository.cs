using Microsoft.EntityFrameworkCore;
using Reviews.Core.DTO;
using Reviews.Core.Models;
using Reviews.Persistence.Contexts;
using Reviews.Persistence.Repositories.Interfaces;
using System.Linq.Expressions;

namespace Reviews.Persistence.Repositories
{
	public class MovieRepository(Context context) : Repository<Movie, Guid>(context), IMovieRepository
	{
		public async Task<PartialData<Movie>> GetFilteredListAsync(Expression<Func<Movie, bool>>? predicate = null,
			int? skip = null, int? take = null)
		{
			IQueryable<Movie> query = _dbSet.AsNoTracking();

			if (predicate != null)
			{
				query = query.Where(predicate);
			}

			int totalAmount = await query.CountAsync();

			query = query
				.OrderByDescending(m => m.Ratings!.Sum(r => r.Point))
				.Skip(skip ?? 0).Take(take ?? totalAmount);

			return new PartialData<Movie>()
			{
				Data = await query.ToListAsync(),
				TotalAmount = totalAmount
			};
		}

		public async Task<Movie[]> GetFilteredListAsync(Guid[] movieIds)
		{
			return await _dbSet.AsNoTracking().Where(movie => movieIds.Contains(movie.Id)).ToArrayAsync();
		}

		public async Task<SimpleMovie[]> GetSimpledListAsync(Expression<Func<Movie, bool>>? predicate = null)
		{
			var query = _dbSet.AsNoTracking();

			if (predicate != null)
			{
				query = query.Where(predicate);
			}

			return await query.Include(m => m.Genres)
				.Select(m => new SimpleMovie
				{
					Id = m.Id,
					GenreIds = m.Genres != null
						? m.Genres.Select(g => g.Id).ToArray()
						: Array.Empty<Guid>()
				}).ToArrayAsync();
		}

		public override async Task<Movie?> GetByIdAsync(Guid id)
		{
			return await _dbSet.Include(m => m.Genres).FirstOrDefaultAsync(m => m.Id == id);
		}
	}
}
