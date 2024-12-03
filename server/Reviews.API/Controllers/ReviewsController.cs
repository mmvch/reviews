using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Reviews.API.Contracts.Requests;
using Reviews.Application.Services.Interfaces;
using Reviews.Core.Constants;
using Reviews.Core.DTO;
using Reviews.Core.DTO.Filters;
using Reviews.Core.Models;

namespace Reviews.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ReviewsController : ControllerBase
	{
		private readonly IReviewService _reviewService;
		private readonly IUserService _userService;

		public ReviewsController(IReviewService reviewService, IUserService userService)
		{
			_reviewService = reviewService;
			_userService = userService;
		}

		[HttpGet]
		public async Task<PartialData<Review>> GetFilteredListAsync([FromQuery] ReviewFilter filter)
		{
			return await _reviewService.GetFilteredListAsync(filter);
		}

		[HttpGet("Count")]
		public async Task<int> GetCountAsync([FromQuery] Guid movieId)
		{
			return await _reviewService.GetCountAsync(movieId);
		}

		[HttpGet("Average")]
		public async Task<double?> GetReviewersRatingAsync([FromQuery] Guid movieId)
		{
			return await _reviewService.GetReviewersRatingAsync(movieId);
		}

		[HttpGet("ByCurrentUser")]
		[Authorize(Roles = AppRoles.Reviewer)]
		public async Task<Review?> GetForCurrentUserAndMovieAsync([FromQuery] Guid movieId)
		{
			User user = await _userService.GetUserAsync(User);
			return await _reviewService.GetForMovieAndUserAsync(movieId, user.Id);
		}

		[HttpPost]
		[Authorize(Roles = AppRoles.Reviewer)]
		public async Task<Review> CreateAsync([FromBody] ReviewRequest request)
		{
			User user = await _userService.GetUserAsync(User);

			Review review = new()
			{
				Id = Guid.NewGuid(),
				User = user,
				CreationDate = DateTime.Now,
				MovieId = request.MovieId,
				Text = request.Text,
				Point = request.Point
			};

			await _reviewService.CreateAsync(review);

			return review;
		}

		[HttpPatch]
		[Authorize(Roles = AppRoles.Reviewer)]
		public async Task<IActionResult> UpdateAsync([FromBody] ReviewRequest request)
		{
			User user = await _userService.GetUserAsync(User);
			Review review = await _reviewService.GetByIdAsync(request.Id);

			if (review.UserId != user.Id)
			{
				return Forbid("Only author can edit");
			}

			review.Text = string.IsNullOrWhiteSpace(request.Text) ? review.Text : request.Text;
			review.CreationDate = DateTime.Now;
			review.Point = request.Point;
			review.Reactions = null;

			await _reviewService.UpdateAsync(review);
			return Ok();
		}

		[HttpDelete("{id}")]
		[Authorize(Roles = AppRoles.Reviewer)]
		public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
		{
			User user = await _userService.GetUserAsync(User);
			Review review = await _reviewService.GetByIdAsync(id);

			if (review.UserId != user.Id)
			{
				return Forbid("Only author can delete");
			}

			await _reviewService.DeleteAsync(review);
			return Ok();
		}
	}
}
