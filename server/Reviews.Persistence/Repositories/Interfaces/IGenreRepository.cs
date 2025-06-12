using Reviews.Core.DTO;
using Reviews.Core.Models;
using System.Linq.Expressions;

namespace Reviews.Persistence.Repositories.Interfaces
{
	public interface IGenreRepository : IRepository<Genre, Guid>
	{
		Task<PartialData<Genre>> GetFilteredListAsync(Expression<Func<Genre, bool>>? predicate = null,
			int? skip = null, int? take = null);
		Task<ICollection<Genre>?> GetExistedAsync(IEnumerable<Guid> genres);
		Task<Dictionary<Guid, int>> GetFavoriteGenreIdsAsync(Guid userId, int positivePoint);
		Task<Genre?> GetByNameAsync(string name);
	}
}
