using Reviews.Core.DTO;
using Reviews.Core.DTO.Filters;
using Reviews.Core.Models;

namespace Reviews.Application.Services.Interfaces
{
    public interface IGenreService
	{
		Task<PartialData<Genre>> GetFilteredListAsync(GenreFilter filter);
		Task<ICollection<Genre>?> GetExistedAsync(IEnumerable<Guid>? genres);
		Task CreateAsync(Genre genre);
		Task UpdateAsync(Genre genre);
		Task DeleteAsync(Guid id);
	}
}
