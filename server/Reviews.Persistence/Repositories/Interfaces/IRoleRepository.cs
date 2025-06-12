using Reviews.Core.Models;

namespace Reviews.Persistence.Repositories.Interfaces
{
	public interface IRoleRepository : IRepository<Role, Guid>
	{
		Task<Role?> GetByNameAsync(string name);
	}
}
