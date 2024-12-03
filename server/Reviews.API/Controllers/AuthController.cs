using Microsoft.AspNetCore.Mvc;
using Reviews.Application.Services.Interfaces;
using Reviews.Core.DTO;

namespace Reviews.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly IAuthService _authService;

		public AuthController(IAuthService authService)
		{
			_authService = authService;
		}

		[HttpPost("register")]
		public async Task<string> RegisterAsync([FromBody] Credentials credentials)
		{
			return await _authService.RegisterAsync(credentials);
		}

		[HttpPost("login")]
		public async Task<string> LoginAsync([FromBody] Credentials credentials)
		{
			return await _authService.LoginAsync(credentials);
		}
	}
}
