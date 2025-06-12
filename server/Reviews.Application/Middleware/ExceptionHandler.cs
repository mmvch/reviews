using Microsoft.AspNetCore.Http;
using Reviews.Core.Exceptions;
using System.Text.Json;

namespace Reviews.Application.Middleware
{
	public class ExceptionHandler
	{
		private readonly RequestDelegate _next;

		public ExceptionHandler(RequestDelegate next)
		{
			_next = next;
		}

		public async Task InvokeAsync(HttpContext httpContext)
		{
			try
			{
				await _next(httpContext);
			}
			catch (ServiceException exception)
			{
				await HandleServiceException(httpContext, exception);
			}
			catch (Exception exception)
			{
				await HandleException(httpContext, exception);
			}
		}

		private static async Task HandleServiceException(HttpContext context, ServiceException serviceException)
		{
			await HandleException(context, serviceException, (int)serviceException.HttpStatusCode);
		}

		private static async Task HandleException(HttpContext context, Exception exception, int httpStatusCode = 500)
		{
			context.Response.StatusCode = httpStatusCode;
			context.Response.ContentType = "application/json";

			string json = JsonSerializer.Serialize(new
			{
				status = httpStatusCode,
				message = exception.Message
			});

			await context.Response.WriteAsync(json);
		}
	}
}
