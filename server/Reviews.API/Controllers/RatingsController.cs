using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Reviews.API.Contracts.Requests;
using Reviews.Application.Services.Interfaces;
using Reviews.Core.Constants;
using Reviews.Core.Models;

namespace Reviews.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class RatingsController : ControllerBase
	{
		private readonly IRatingService _ratingService;
		private readonly IUserService _userService;

		public RatingsController(IRatingService ratingService, IUserService userService)
		{
			_ratingService = ratingService;
			_userService = userService;
		}

		[HttpGet("Count")]
		public async Task<int> GetCountAsync([FromQuery] Guid movieId)
		{
			return await _ratingService.GetCountAsync(movieId);
		}

		[HttpGet("Average")]
		public async Task<double?> GetRatersRatingAsync([FromQuery] Guid movieId)
		{
			return await _ratingService.GetRatersRatingAsync(movieId);
		}

		[HttpGet]
		[Authorize(Roles = AppRoles.Rater)]
		public async Task<Rating?> GetAsync([FromQuery] Guid movieId)
		{
			User user = await _userService.GetUserAsync(User);
			return await _ratingService.GetForUserAsync(movieId, user.Id);
		}

		[HttpPost]
		[Authorize(Roles = AppRoles.Rater)]
		public async Task CreateAsync([FromBody] RatingRequest request)
		{
			User user = await _userService.GetUserAsync(User);

			Rating rating = new()
			{
				UserId = user.Id,
				MovieId = request.MovieId,
				Point = request.Point
			};

			await _ratingService.CreateAsync(rating);
		}

		[HttpPatch]
		[Authorize(Roles = AppRoles.Rater)]
		public async Task UpdateAsync([FromBody] RatingRequest request)
		{
			User user = await _userService.GetUserAsync(User);

			Rating rating = new()
			{
				UserId = user.Id,
				MovieId = request.MovieId,
				Point = request.Point
			};

			await _ratingService.UpdateAsync(rating);
		}

		[HttpDelete]
		[Authorize(Roles = AppRoles.Rater)]
		public async Task DeleteAsync([FromQuery] Guid movieId)
		{
			User user = await _userService.GetUserAsync(User);
			await _ratingService.DeleteAsync(movieId, user.Id);
		}
	}
}
