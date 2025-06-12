using Microsoft.EntityFrameworkCore;
using Reviews.Core.DTO;
using Reviews.Core.Models;
using Reviews.Persistence.Contexts;
using Reviews.Persistence.Repositories.Interfaces;
using System.Linq.Expressions;

namespace Reviews.Persistence.Repositories
{
	public class UserRepository(Context context) : Repository<User, Guid>(context), IUserRepository
	{
		public async Task<PartialData<User>> GetFilteredListAsync(Expression<Func<User, bool>>? predicate = null,
			int? skip = null, int? take = null, params Expression<Func<User, object?>>[] includes)
		{
			IQueryable<User> query = _dbSet.AsNoTracking();

			if (predicate != null)
			{
				query = query.Where(predicate);
			}

			int totalAmount = await query.CountAsync();

			foreach (var include in includes)
			{
				query = query.Include(include);
			}

			return new PartialData<User>()
			{
				Data = await query
					.OrderBy(user => user.Name)
					.Skip(skip ?? 0).Take(take ?? totalAmount)
					.ToListAsync(),
				TotalAmount = totalAmount
			};
		}

		public async Task<User?> GetByNameAsync(string name)
		{
			return await _dbSet.AsNoTracking().Include(user => user.Role).FirstOrDefaultAsync(user => user.Name == name);
		}
	}
}
