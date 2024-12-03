namespace Reviews.Application.Services.Interfaces
{
	public interface IReactionService
	{
		Task<bool?> GetAsync(Guid reviewId, Guid userId);
		Task CreateAsync(Guid reviewId, Guid userId, bool value);
		Task UpdateAsync(Guid reviewId, Guid userId, bool value);
		Task DeleteAsync(Guid reviewId, Guid userId);
	}
}
