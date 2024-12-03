using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Reviews.Application.Services.Interfaces;
using Reviews.Core.Constants;
using Reviews.Core.DTO;
using Reviews.Core.DTO.Filters;
using Reviews.Core.Models;

namespace Reviews.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class GenresController : ControllerBase
	{
		private readonly IGenreService _genreService;

		public GenresController(IGenreService genreService)
		{
			_genreService = genreService;
		}

		[HttpGet]
		public async Task<PartialData<Genre>> GetFilteredListAsync([FromQuery] GenreFilter filter)
		{
			return await _genreService.GetFilteredListAsync(filter);
		}

		[HttpPost]
		[Authorize(Roles = AppRoles.Admin)]
		public async Task CreateAsync([FromBody] Genre genre)
		{
			await _genreService.CreateAsync(genre);
		}

		[HttpPatch]
		[Authorize(Roles = AppRoles.Admin)]
		public async Task UpdateAsync([FromBody] Genre genre)
		{
			await _genreService.UpdateAsync(genre);
		}

		[HttpDelete("{id}")]
		[Authorize(Roles = AppRoles.Admin)]
		public async Task DeleteAsync([FromRoute] Guid id)
		{
			await _genreService.DeleteAsync(id);
		}
	}
}
