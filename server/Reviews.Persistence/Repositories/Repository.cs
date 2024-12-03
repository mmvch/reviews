using Microsoft.EntityFrameworkCore;
using Reviews.Persistence.Contexts;
using Reviews.Persistence.Repositories.Interfaces;

namespace Reviews.Persistence.Repositories
{
	public class Repository<TEntity, TKey> : IRepository<TEntity, TKey> where TEntity : class
	{
		protected readonly Context _context;
		protected readonly DbSet<TEntity> _dbSet;

		public Repository(Context context)
		{
			_context = context;
			_dbSet = context.Set<TEntity>();
		}

		public async Task<IEnumerable<TEntity>> GetAllAsync()
		{
			return await _dbSet.AsNoTracking().ToListAsync();
		}

		public virtual async Task<TEntity?> GetByIdAsync(TKey id)
		{
			return await _dbSet.FindAsync(id);
		}

		public async Task CreateAsync(TEntity entity)
		{
			await _dbSet.AddAsync(entity);
			await _context.SaveChangesAsync();
		}

		public async Task UpdateAsync(TEntity entity)
		{
			_dbSet.Attach(entity);
			_context.Entry(entity).State = EntityState.Modified;
			await _context.SaveChangesAsync();
		}

		public async Task<TEntity?> DeleteAsync(TKey id)
		{
			TEntity? entity = await _dbSet.FindAsync(id);

			if (entity != null)
			{
				await DeleteAsync(entity);
			}

			return entity;
		}

		public async Task DeleteAsync(TEntity entity)
		{
			_dbSet.Remove(entity);
			await _context.SaveChangesAsync();
		}

		public async Task DeleteRangeAsync(IEnumerable<TEntity> entities)
		{
			_dbSet.RemoveRange(entities);
			await _context.SaveChangesAsync();
		}

		#region dispose
		private bool disposed = false;

		public void Dispose()
		{
			Dispose(true);
			GC.SuppressFinalize(this);
		}

		private void Dispose(bool disposing)
		{
			if (!disposed)
			{
				if (disposing)
				{
					_context.Dispose();
				}
			}

			disposed = true;
		}
		#endregion
	}
}
