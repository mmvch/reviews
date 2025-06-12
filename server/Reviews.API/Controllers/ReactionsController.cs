using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Reviews.API.Contracts.Requests;
using Reviews.API.Contracts.Responses;
using Reviews.Application.Services.Interfaces;
using Reviews.Core.Models;

namespace Reviews.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController, Authorize]
	public class ReactionsController : ControllerBase
	{
		private readonly IReactionService _reactionService;
		private readonly IUserService _userService;

		public ReactionsController(IReactionService reactionService, IUserService userService)
		{
			_reactionService = reactionService;
			_userService = userService;
		}

		[HttpGet]
		[Authorize]
		public async Task<ReactionResponse> GetAsync([FromQuery] Guid reviewId)
		{
			User user = await _userService.GetUserAsync(User);

			return new ReactionResponse()
			{
				IsLiked = await _reactionService.GetAsync(reviewId, user.Id)
			};
		}

		[HttpPost]
		[Authorize]
		public async Task CreateAsync([FromBody] ReactionRequest request)
		{
			User user = await _userService.GetUserAsync(User);
			await _reactionService.CreateAsync(request.ReviewId, user.Id, request.IsLiked);
		}

		[HttpPatch]
		[Authorize]
		public async Task UpdateAsync([FromBody] ReactionRequest request)
		{
			User user = await _userService.GetUserAsync(User);
			await _reactionService.UpdateAsync(request.ReviewId, user.Id, request.IsLiked);
		}

		[HttpDelete]
		[Authorize]
		public async Task DeleteAsync([FromQuery] Guid reviewId)
		{
			User user = await _userService.GetUserAsync(User);
			await _reactionService.DeleteAsync(reviewId, user.Id);
		}
	}
}
