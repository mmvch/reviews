using Reviews.Core.DTO;
using Reviews.Core.Models;
using System.Linq.Expressions;

namespace Reviews.Persistence.Repositories.Interfaces
{
	public interface IUserRepository : IRepository<User, Guid>
	{
		Task<PartialData<User>> GetFilteredListAsync(Expression<Func<User, bool>>? predicate = null,
			int? skip = null, int? take = null, params Expression<Func<User, object?>>[] includes);
		Task<User?> GetByNameAsync(string name);
	}
}
