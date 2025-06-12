namespace Reviews.Core.DTO
{
	public class PartialData<TEntity>
	{
		public IEnumerable<TEntity> Data { get; set; } = [];
		public int TotalAmount { get; set; }
	}
}
