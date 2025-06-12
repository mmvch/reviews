using Microsoft.EntityFrameworkCore;
using Reviews.Core.DTO;
using Reviews.Core.Models;
using Reviews.Persistence.Contexts;
using Reviews.Persistence.Repositories.Interfaces;
using System.Linq.Expressions;

namespace Reviews.Persistence.Repositories
{
	public class GenreRepository(Context context) : Repository<Genre, Guid>(context), IGenreRepository
	{
		public async Task<PartialData<Genre>> GetFilteredListAsync(Expression<Func<Genre, bool>>? predicate = null,
			int? skip = null, int? take = null)
		{
			IQueryable<Genre> query = _dbSet.AsNoTracking();

			if (predicate != null)
			{
				query = query.Where(predicate);
			}

			int totalAmount = await query.CountAsync();

			return new PartialData<Genre>()
			{
				Data = await query
				.OrderBy(genre => genre.Name)
				.Skip(skip ?? 0).Take(take ?? totalAmount)
				.ToListAsync(),
				TotalAmount = totalAmount
			};
		}

		public async Task<ICollection<Genre>?> GetExistedAsync(IEnumerable<Guid> genres)
		{
			return await _dbSet.Where(g1 => genres.Any(g2 => g2 == g1.Id)).ToListAsync();
		}

		public async Task<Dictionary<Guid, int>> GetFavoriteGenreIdsAsync(Guid userId, int positivePoint)
		{
			return await _context.Ratings.AsNoTracking()
				.Where(r => r.UserId == userId && r.Point >= positivePoint)
				.SelectMany(r => r.Movie!.Genres!)
				.GroupBy(g => g.Id)
				.Select(group => new
				{
					GenreId = group.Key,
					Count = group.Count()
				})
				.ToDictionaryAsync(g => g.GenreId, g => g.Count);
		}

		public async Task<Genre?> GetByNameAsync(string name)
		{
			return await _dbSet.AsNoTracking().FirstOrDefaultAsync(genre => genre.Name == name);
		}
	}
}
