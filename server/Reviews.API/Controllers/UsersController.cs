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
	public class UsersController : ControllerBase
	{
		private readonly IUserService _userService;

		public UsersController(IUserService userService)
		{
			_userService = userService;
		}

		[HttpGet]
		[Authorize(Roles = AppRoles.Admin)]
		public async Task<PartialData<User>> GetFilteredListAsync([FromQuery] UserFilter filter)
		{
			return await _userService.GetFilteredListAsync(filter);
		}


		[HttpPatch]
		[Authorize(Roles = AppRoles.Admin)]
		public async Task ChangeRoleAsync([FromBody] ChangeRoleRequest request)
		{
			await _userService.ChangeRoleAsync(request.UserId, request.RoleName);
		}
	}
}
