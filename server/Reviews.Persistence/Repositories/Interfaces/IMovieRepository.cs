using Reviews.Core.DTO;
using Reviews.Core.Models;
using System.Linq.Expressions;

namespace Reviews.Persistence.Repositories.Interfaces
{
	public interface IMovieRepository : IRepository<Movie, Guid>
	{
		Task<PartialData<Movie>> GetFilteredListAsync(Expression<Func<Movie, bool>>? predicate = null,
			int? skip = null, int? take = null);
		Task<Movie[]> GetFilteredListAsync(Guid[] movieIds);
		Task<SimpleMovie[]> GetSimpledListAsync(Expression<Func<Movie, bool>>? predicate = null);
	}
}
