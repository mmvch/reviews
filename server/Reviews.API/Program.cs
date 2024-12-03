using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Reviews.Application.Middleware;
using Reviews.Application.Services;
using Reviews.Application.Services.Interfaces;
using Reviews.Core.Options;
using Reviews.Infrastructure.Services;
using Reviews.Infrastructure.Services.Interfaces;
using Reviews.Persistence.Contexts;
using Reviews.Persistence.Repositories;
using Reviews.Persistence.Repositories.Interfaces;
using System.Text;

namespace Reviews.API
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			builder.Services.AddControllers();

			builder.Services.AddSwaggerGen();

			builder.Services.AddCors(options =>
			{
				options.AddPolicy(name: "Library", policy =>
				{
					policy.WithOrigins("http://localhost:3000")
						  .AllowAnyMethod()
						  .AllowAnyHeader()
						  .AllowCredentials();
				});
			});

			builder.Services.AddScoped<IUserRepository, UserRepository>();
			builder.Services.AddScoped<IRoleRepository, RoleRepository>();
			builder.Services.AddScoped<IMovieRepository, MovieRepository>();
			builder.Services.AddScoped<IGenreRepository, GenreRepository>();
			builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
			builder.Services.AddScoped<IReactionRepository, ReactionRepository>();
			builder.Services.AddScoped<IRatingRepository, RatingRepository>();

			builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
			builder.Services.AddScoped<IJwtProvider, JwtProvider>();
			builder.Services.AddScoped<IImageService, ImageService>();

			builder.Services.AddScoped<IUserService, UserService>();
			builder.Services.AddScoped<IAuthService, AuthService>();
			builder.Services.AddScoped<IGenreService, GenreService>();
			builder.Services.AddScoped<IMovieService, MovieService>();
			builder.Services.AddScoped<IReviewService, ReviewService>();
			builder.Services.AddScoped<IReactionService, ReactionService>();
			builder.Services.AddScoped<IRatingService, RatingService>();
			builder.Services.AddScoped<IRecommendationService, RecommendationService>();

			string connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
				throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

			builder.Services.AddDbContext<Context>(options =>
				options.UseSqlServer(connectionString));

			builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(nameof(JwtOptions)));

			builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
				.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
				{
					JwtOptions jwtOptions = builder.Configuration.GetSection(nameof(JwtOptions)).Get<JwtOptions>()!;

					options.TokenValidationParameters = new TokenValidationParameters()
					{
						ValidateIssuerSigningKey = true,
						ValidIssuer = jwtOptions.Issuer,
						ValidAudience = jwtOptions.Audience,
						IssuerSigningKey = new SymmetricSecurityKey(
							Encoding.UTF8.GetBytes(jwtOptions.SecretKey))
					};
				});

			var app = builder.Build();

			using (var scope = app.Services.CreateScope())
			{
				var serviceProvider = scope.ServiceProvider.GetRequiredService<Context>();
				serviceProvider.Database.Migrate();
			}

			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			app.UseStaticFiles();

			app.UseCors("Library");

			app.UseHttpsRedirection();

			app.UseMiddleware<ExceptionHandler>();

			app.UseAuthentication();
			app.UseAuthorization();

			app.MapControllers();

			app.Run();
		}
	}
}
