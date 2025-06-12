namespace Reviews.Core.Constants
{
	public class AppRoles
	{
		public const string Admin = "Admin";
		public const string Reviewer = "Reviewer";
		public const string Rater = "Rater";

		public static IEnumerable<string> Roles
		{
			get
			{
				yield return Admin;
				yield return Reviewer;
				yield return Rater;
			}
		}
	}
}
