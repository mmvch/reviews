using Reviews.Core.DTO;
using Reviews.Core.DTO.Filters;
using Reviews.Core.Models;

namespace Reviews.Application.Services.Interfaces
{
	public interface IMovieService
	{
		Task<PartialData<Movie>> GetFilteredListAsync(MovieFilter filter);
		Task<Movie> GetByIdAsync(Guid id);
		Task CreateAsync(Movie movie);
		Task UpdateAsync(Movie movie);
		Task<Movie> DeleteAsync(Guid id);
	}
}
