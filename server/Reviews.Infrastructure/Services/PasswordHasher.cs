using Reviews.Infrastructure.Services.Interfaces;
using static BCrypt.Net.BCrypt;

namespace Reviews.Infrastructure.Services
{
	public class PasswordHasher : IPasswordHasher
	{
		public string Generate(string password) =>
			EnhancedHashPassword(password);

		public bool Verify(string password, string hashedPassword) =>
			EnhancedVerify(password, hashedPassword);
	}
}
