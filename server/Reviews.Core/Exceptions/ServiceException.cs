using System.Net;

namespace Reviews.Core.Exceptions
{
	public class ServiceException : Exception
	{
		public HttpStatusCode HttpStatusCode { get; set; }

		public ServiceException(string message, HttpStatusCode httpStatusCode = HttpStatusCode.InternalServerError)
			: base(message)
		{
			HttpStatusCode = httpStatusCode;
		}
	}
}
