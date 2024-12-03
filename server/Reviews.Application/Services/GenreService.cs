using Reviews.Application.Services.Interfaces;
using Reviews.Core.DTO;
using Reviews.Core.DTO.Filters;
using Reviews.Core.Exceptions;
using Reviews.Core.Extensions;
using Reviews.Core.Models;
using Reviews.Persistence.Repositories.Interfaces;
using System.Net;

namespace Reviews.Application.Services
{
	public class GenreService : IGenreService
	{
		private readonly IGenreRepository _genreRepository;

		public GenreService(IGenreRepository genreRepository)
		{
			_genreRepository = genreRepository;
		}

		public async Task<PartialData<Genre>> GetFilteredListAsync(GenreFilter filter)
		{
			return await _genreRepository.GetFilteredListAsync(filter.GetPredicate(), filter.CurrentPage * filter.PageSize, filter.PageSize);
		}

		public async Task<ICollection<Genre>?> GetExistedAsync(IEnumerable<Guid>? genres)
		{
			if (genres == null || !genres.Any())
			{
				return null;
			}

			return await _genreRepository.GetExistedAsync(genres);
		}

		public async Task CreateAsync(Genre genre)
		{
			if (await _genreRepository.GetByNameAsync(genre.Name) != null)
			{
				throw new ServiceException($"Genre with name \"{genre.Name}\" already exist", HttpStatusCode.Conflict);
			}

			await _genreRepository.CreateAsync(genre);
		}

		public async Task UpdateAsync(Genre genre)
		{
			if (await _genreRepository.GetByNameAsync(genre.Name) != null)
			{
				throw new ServiceException($"Genre with name \"{genre.Name}\" already exist", HttpStatusCode.Conflict);
			}

			await _genreRepository.UpdateAsync(genre);
		}

		public async Task DeleteAsync(Guid id)
		{
			await _genreRepository.DeleteAsync(id);
		}
	}
}
