using Microsoft.AspNetCore.Http;

namespace Reviews.Infrastructure.Services.Interfaces
{
	public interface IImageService
	{
		Task<string> ReplaceAsync(IFormFile formFile, string imageName);
		Task<string> UploadAsync(IFormFile formFile);
		void Delete(string imageName);
	}
}
