using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Reviews.Core.Constants;
using Reviews.Core.Models;
using Reviews.Core.Options;
using Reviews.Infrastructure.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Reviews.Infrastructure.Services
{
	public class JwtProvider : IJwtProvider
	{
		private readonly JwtOptions _jwtOptions;

		public JwtProvider(IOptions<JwtOptions> jwtOptions)
		{
			_jwtOptions = jwtOptions.Value;
		}

		public string GenerateToken(User user)
		{
			Claim[] claims = [
				new Claim(ClaimTypes.Name, user.Name),
				new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
				new Claim(ClaimTypes.Role, user.Role?.Name ?? AppRoles.Reviewer)
			];

			SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey));
			SigningCredentials credentials = new(key, SecurityAlgorithms.HmacSha256);

			JwtSecurityToken jwtToken = new(
				_jwtOptions.Issuer,
				_jwtOptions.Audience,
				claims,
				expires: DateTime.UtcNow.AddHours(_jwtOptions.ExpiresHours),
				signingCredentials: credentials);

			return new JwtSecurityTokenHandler().WriteToken(jwtToken);
		}
	}
}
