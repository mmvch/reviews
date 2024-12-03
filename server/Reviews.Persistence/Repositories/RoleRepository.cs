using Microsoft.EntityFrameworkCore;
using Reviews.Core.Models;
using Reviews.Persistence.Contexts;
using Reviews.Persistence.Repositories.Interfaces;

namespace Reviews.Persistence.Repositories
{
	public class RoleRepository(Context context) : Repository<Role, Guid>(context), IRoleRepository
	{
		public async Task<Role?> GetByNameAsync(string name)
		{
			return await _dbSet.FirstOrDefaultAsync(role => role.Name == name); ;
		}
	}
}
