using Microsoft.EntityFrameworkCore;
using Reviews.Core.Constants;
using Reviews.Core.Models;

namespace Reviews.Persistence.Contexts
{
	public class Context : DbContext
	{
		public DbSet<User> Users { get; set; }
		public DbSet<Role> Roles { get; set; }
		public DbSet<Movie> Movies { get; set; }
		public DbSet<Genre> Genres { get; set; }
		public DbSet<GenreMovie> GenreMovies { get; set; }
		public DbSet<Rating> Ratings { get; set; }
		public DbSet<Review> Reviews { get; set; }
		public DbSet<ReviewReaction> ReviewReactions { get; set; }

		public Context(DbContextOptions<Context> options) : base(options) { }

		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);

			builder.Entity<Movie>()
				.HasMany(m => m.Genres)
				.WithMany(g => g.Movies)
				.UsingEntity<GenreMovie>();

			builder.Entity<GenreMovie>()
				.HasOne(gm => gm.Genre)
				.WithMany()
				.HasForeignKey(gm => gm.GenreId)
				.OnDelete(DeleteBehavior.Cascade);

			builder.Entity<GenreMovie>()
				.HasOne(gm => gm.Movie)
				.WithMany()
				.HasForeignKey(gm => gm.MovieId)
				.OnDelete(DeleteBehavior.Cascade);

			builder.Entity<Rating>()
				.HasKey(r => new { r.UserId, r.MovieId });

			builder.Entity<Rating>()
				.HasOne(r => r.User)
				.WithMany(u => u.Ratings)
				.HasForeignKey(r => r.UserId)
				.OnDelete(DeleteBehavior.Cascade);

			builder.Entity<Rating>()
				.HasOne(r => r.Movie)
				.WithMany(m => m.Ratings)
				.HasForeignKey(r => r.MovieId)
				.OnDelete(DeleteBehavior.Cascade);

			builder.Entity<ReviewReaction>()
				.HasKey(rr => new { rr.UserId, rr.ReviewId });

			builder.Entity<ReviewReaction>()
				.HasOne(ur => ur.User)
				.WithMany(u => u.Reactions)
				.HasForeignKey(ur => ur.UserId)
				.OnDelete(DeleteBehavior.Cascade);

			builder.Entity<ReviewReaction>()
				.HasOne(ur => ur.Review)
				.WithMany(r => r.Reactions)
				.HasForeignKey(ur => ur.ReviewId)
				.OnDelete(DeleteBehavior.Cascade);

			builder.Entity<Review>()
				.HasOne(r => r.User)
				.WithMany(u => u.Reviews)
				.HasForeignKey(r => r.UserId)
				.OnDelete(DeleteBehavior.NoAction);

			builder.Entity<Review>()
				.HasOne(r => r.Movie)
				.WithMany(m => m.Reviews)
				.HasForeignKey(r => r.MovieId)
				.OnDelete(DeleteBehavior.NoAction);

			builder.Entity<User>()
				.HasOne(u => u.Role)
				.WithMany(r => r.Users)
				.HasForeignKey(u => u.RoleId)
				.OnDelete(DeleteBehavior.NoAction);

			builder.Entity<User>().HasIndex(u => u.Name).IsUnique();
			builder.Entity<Role>().HasIndex(r => r.Name).IsUnique();
			builder.Entity<Genre>().HasIndex(g => g.Name).IsUnique();

			SetData(builder);
		}

		private static void SetData(ModelBuilder builder)
		{
			Role[] roles = [
				new Role()
				{
					Id = Guid.Parse("2022BCC4-853D-4886-A801-AB10798C8435"),
					Name = AppRoles.Admin
				},
				new Role()
				{
					Id = Guid.Parse("AA615521-C2BD-4727-8F8E-53594B2FFC49"),
					Name = AppRoles.Reviewer
				},
				new Role()
				{
					Id = Guid.Parse("775952A3-6C3C-4A95-9852-E5E5624E13B6"),
					Name = AppRoles.Rater
				}
			];

			User admin = new()
			{
				Id = Guid.Parse("CFE2536F-E45F-4B3C-9455-9983483531AD"),
				Name = "admin",
				PasswordHash = "$2a$11$OB1MZbDdUs0FGipMXFNGJ.v7sa5NqGMV9emFYzTJs232v6.3ruMLW",
				RoleId = Guid.Parse("2022BCC4-853D-4886-A801-AB10798C8435")
			};

			builder.Entity<Role>().HasData(roles);
			builder.Entity<User>().HasData(admin);
		}
	}
}
