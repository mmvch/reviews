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
	public class MovieService : IMovieService
	{
		private readonly IMovieRepository _movieRepository;

		public MovieService(IMovieRepository movieRepository)
		{
			_movieRepository = movieRepository;
		}

		public async Task<PartialData<Movie>> GetFilteredListAsync(MovieFilter filter)
		{
			return await _movieRepository.GetFilteredListAsync(
				filter.GetPredicate(),
				filter.CurrentPage * filter.PageSize,
				filter.PageSize
			);
		}

		public async Task<Movie> GetByIdAsync(Guid id)
		{
			return await _movieRepository.GetByIdAsync(id)
				?? throw new ServiceException("Movie not found", HttpStatusCode.NotFound);
		}

		public async Task CreateAsync(Movie movie)
		{
			await _movieRepository.CreateAsync(movie);
		}

		public async Task UpdateAsync(Movie movie)
		{
			await _movieRepository.UpdateAsync(movie);
		}

		public async Task<Movie> DeleteAsync(Guid id)
		{
			return await _movieRepository.DeleteAsync(id)
				?? throw new ServiceException("Movie not found", HttpStatusCode.NotFound);
		}
	}
}
