using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Reviews.API.Contracts.Requests;
using Reviews.API.Contracts.Responses;
using Reviews.Application.Services.Interfaces;
using Reviews.Core.Constants;
using Reviews.Core.DTO;
using Reviews.Core.DTO.Filters;
using Reviews.Core.Models;
using Reviews.Infrastructure.Services.Interfaces;

namespace Reviews.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class MoviesController : ControllerBase
	{
		private readonly IMovieService _movieService;
		private readonly IImageService _imageService;
		private readonly IGenreService _genreService;
		private readonly IRecommendationService _recommendationService;
		private readonly IUserService _userService;

		public MoviesController(IMovieService movieService, IImageService imageService, IGenreService genreService,
			IUserService userService, IRecommendationService recommendationService)
		{
			_movieService = movieService;
			_imageService = imageService;
			_genreService = genreService;
			_userService = userService;
			_recommendationService = recommendationService;
		}

		[HttpGet]
		public async Task<PartialData<Movie>> GetFilteredListAsync([FromQuery] MovieFilter filter)
		{
			return await _movieService.GetFilteredListAsync(filter);
		}

		[HttpGet("{id}")]
		public async Task<Movie> GetByIdAsync([FromRoute] Guid id)
		{
			return await _movieService.GetByIdAsync(id);
		}

		[HttpGet("Recommendation")]
		[Authorize]
		public async Task<PartialData<MovieResponse>> GetRecommendationAsync([FromQuery] MovieFilter filter)
		{
			User user = await _userService.GetUserAsync(User);
			var movieScores = await _recommendationService.GetRecommendationsAsync(user.Id, filter);

			return new PartialData<MovieResponse>()
			{
				Data = movieScores.Data.Select(ms => new MovieResponse
				{
					Id = ms.Movie.Id,
					Name = ms.Movie.Name,
					ReleaseDate = ms.Movie.ReleaseDate,
					PosterFileName = ms.Movie.PosterFileName,
					Score = ms.Score
				}),
				TotalAmount = movieScores.TotalAmount
			};
		}

		[HttpPost]
		[Authorize(Roles = AppRoles.Admin)]
		public async Task<Guid> CreateAsync([FromForm] MovieRequest request)
		{
			Movie movie = new()
			{
				Id = Guid.NewGuid(),
				Name = request.Name,
				Description = request.Description,
				ReleaseDate = request.ReleaseDate
			};

			if (request.Genres != null && request.Genres.Count != 0)
			{
				movie.Genres = await _genreService.GetExistedAsync(request.Genres);
			}

			if (request.Image != null)
			{
				movie.PosterFileName = await _imageService.UploadAsync(request.Image);
			}

			await _movieService.CreateAsync(movie);
			return movie.Id;
		}

		[HttpPatch]
		[Authorize(Roles = AppRoles.Admin)]
		public async Task UpdateAsync([FromForm] MovieRequest request)
		{
			Movie movie = await _movieService.GetByIdAsync(request.Id);

			movie.Name = string.IsNullOrWhiteSpace(request.Name) ? movie.Name : request.Name;
			movie.Description = string.IsNullOrWhiteSpace(request.Description) ? movie.Description : request.Description;
			movie.ReleaseDate = request.ReleaseDate == DateTime.MinValue ? movie.ReleaseDate : request.ReleaseDate;
			movie.Genres = await _genreService.GetExistedAsync(request.Genres);

			if (request.Image != null)
			{
				movie.PosterFileName = string.IsNullOrEmpty(movie.PosterFileName)
					? await _imageService.UploadAsync(request.Image)
					: await _imageService.ReplaceAsync(request.Image, movie.PosterFileName!);
			}

			await _movieService.UpdateAsync(movie);
		}

		[HttpDelete("{id}")]
		[Authorize(Roles = AppRoles.Admin)]
		public async Task Delete([FromRoute] Guid id)
		{
			Movie movie = await _movieService.DeleteAsync(id);

			if (movie.PosterFileName != null)
			{
				_imageService.Delete(movie.PosterFileName);
			}
		}
	}
}
