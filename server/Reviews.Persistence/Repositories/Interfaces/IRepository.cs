namespace Reviews.Persistence.Repositories.Interfaces
{
	public interface IRepository<TEntity, TKey> : IDisposable where TEntity : class
	{
		Task<IEnumerable<TEntity>> GetAllAsync();
		Task<TEntity?> GetByIdAsync(TKey id);
		Task CreateAsync(TEntity entity);
		Task UpdateAsync(TEntity entity);
		Task<TEntity?> DeleteAsync(TKey id);
		Task DeleteAsync(TEntity entity);
		Task DeleteRangeAsync(IEnumerable<TEntity> entities);
	}
}
