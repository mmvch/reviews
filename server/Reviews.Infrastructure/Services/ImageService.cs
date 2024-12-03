using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Reviews.Core.Constants;
using Reviews.Core.Exceptions;
using Reviews.Infrastructure.Services.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System.Net;

namespace Reviews.Infrastructure.Services
{
	public class ImageService(IConfiguration configuration) : IImageService
	{
		private readonly IConfiguration _configuration = configuration;

		public async Task<string> ReplaceAsync(IFormFile formFile, string imageName)
		{
			ValidateImage(formFile.FileName);
			Delete(imageName);
			return await SaveImageAsync(formFile);
		}

		public async Task<string> UploadAsync(IFormFile formFile)
		{
			ValidateImage(formFile.FileName);
			return await SaveImageAsync(formFile);
		}

		public void Delete(string fileName)
		{
			try
			{
				string filePath = Path.Combine(_configuration.GetSection("WebRootPath").Value!, "uploads\\images", fileName);
				File.Delete(filePath);
			}
			catch (Exception)
			{
				throw new ServiceException("Deleting image error.");
			}
		}

		private static void ValidateImage(string imageName)
		{
			if (!ImageFileTypes.Extensions.Contains(Path.GetExtension(imageName)))
			{
				throw new ServiceException(
					$"Invalid file extension for image.\n"
					+ $"(Possible extensions: \"{string.Join("\" \"", ImageFileTypes.Extensions)}\")",
					HttpStatusCode.UnsupportedMediaType);
			}
		}

		private async Task<string> SaveImageAsync(IFormFile formFile)
		{
			try
			{
				string fileName = Guid.NewGuid() + ImageFileTypes.Default;
				string filePath = Path.Combine(_configuration.GetSection("WebRootPath").Value!, "uploads\\images", fileName);

				int newWidth = 480;
				int newHeight = 720;

				using (Stream stream = formFile.OpenReadStream())
				{
					using Image image = await Image.LoadAsync(stream);
					image.Mutate(x => x.Resize(newWidth, newHeight));
					await image.SaveAsync(filePath);
				}

				return fileName;
			}
			catch (Exception)
			{
				throw new ServiceException("Uploading image error.");
			}
		}
	}
}
