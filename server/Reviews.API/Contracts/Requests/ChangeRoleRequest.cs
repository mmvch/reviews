namespace Reviews.API.Contracts.Requests
{
	public class ChangeRoleRequest
	{
		public Guid UserId { get; set; }
		public string RoleName { get; set; } = string.Empty;
	}
}
