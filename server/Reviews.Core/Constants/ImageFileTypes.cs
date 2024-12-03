namespace Reviews.Core.Constants
{
	public static class ImageFileTypes
	{
		public const string BMP = ".bmp";
		public const string PNG = ".png";
		public const string JPEG = ".jpeg";

		public static readonly string Default = PNG;

		public static IEnumerable<string> Extensions
		{
			get
			{
				yield return BMP;
				yield return JPEG;
				yield return PNG;
			}
		}
	}
}
