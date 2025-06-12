using Reviews.Application.Services.Interfaces;
using Reviews.Core.Constants;
using Reviews.Core.DTO;
using Reviews.Core.Exceptions;
using Reviews.Core.Models;
using Reviews.Infrastructure.Services.Interfaces;
using Reviews.Persistence.Repositories.Interfaces;
using System.Net;

namespace Reviews.Application.Services
{
	public class AuthService : IAuthService
	{
		private readonly IPasswordHasher _passwordHasher;
		private readonly IJwtProvider _jwtProvider;
		private readonly IUserRepository _userRepository;
		private readonly IRoleRepository _roleRepository;

		public AuthService(IPasswordHasher passwordHasher, IJwtProvider jwtProvider, IUserRepository userRepository, IRoleRepository roleRepository)
		{
			_passwordHasher = passwordHasher;
			_jwtProvider = jwtProvider;
			_userRepository = userRepository;
			_roleRepository = roleRepository;
		}

		public async Task<string> RegisterAsync(Credentials credentials)
		{
			if (await _userRepository.GetByNameAsync(credentials.Username) != null)
			{
				throw new ServiceException("Username already in use", HttpStatusCode.Conflict);
			}

			User user = new()
			{
				Name = credentials.Username,
				PasswordHash = _passwordHasher.Generate(credentials.Password),
				Role = await _roleRepository.GetByNameAsync(AppRoles.Rater)
			};

			await _userRepository.CreateAsync(user);

			return await LoginAsync(credentials);
		}

		public async Task<string> LoginAsync(Credentials credentials)
		{
			User user = await _userRepository.GetByNameAsync(credentials.Username) ??
				throw new ServiceException("Invalid user login", HttpStatusCode.Unauthorized);

			if (!_passwordHasher.Verify(credentials.Password, user.PasswordHash))
			{
				throw new ServiceException("Invalid user password", HttpStatusCode.Unauthorized);

			}

			return _jwtProvider.GenerateToken(user);
		}
	}
}
