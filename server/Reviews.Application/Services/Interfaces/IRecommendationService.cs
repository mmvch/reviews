using Reviews.Core.DTO;
using Reviews.Core.DTO.Filters;
using Reviews.Core.Models;

namespace Reviews.Application.Services.Interfaces
{
	public interface IRecommendationService
	{
		Task<PartialData<(Movie Movie, int Score)>> GetRecommendationsAsync(Guid targetUserId, MovieFilter filter);
	}
}
