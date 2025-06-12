using Reviews.Core.DTO.Filters;
using Reviews.Core.Models;
using System.Linq.Expressions;

namespace Reviews.Core.Extensions
{
	public static class FilterExtensions
	{
		public static Expression<Func<User, bool>>? GetPredicate(this UserFilter filter)
		{
			Expression<Func<User, bool>>? predicate = null;

			if (!string.IsNullOrWhiteSpace(filter.Name))
			{
				Expression<Func<User, bool>> nameConstraint = user => user.Name.Contains(filter.Name);
				predicate = predicate.AndAlso(nameConstraint);
			}

			if (!string.IsNullOrWhiteSpace(filter.RoleName))
			{
				Expression<Func<User, bool>> roleConstraint = user => user.Role!.Name == filter.RoleName;
				predicate = predicate.AndAlso(roleConstraint);
			}

			return predicate;
		}

		public static Expression<Func<Genre, bool>>? GetPredicate(this GenreFilter filter)
		{
			Expression<Func<Genre, bool>>? predicate = null;

			if (!string.IsNullOrWhiteSpace(filter.Name))
			{
				Expression<Func<Genre, bool>> nameConstraint = genre => genre.Name.Contains(filter.Name);
				predicate = predicate.AndAlso(nameConstraint);
			}

			return predicate;
		}

		public static Expression<Func<Movie, bool>>? GetPredicate(this MovieFilter filter)
		{
			Expression<Func<Movie, bool>>? predicate = null;

			if (!string.IsNullOrWhiteSpace(filter.Name))
			{
				Expression<Func<Movie, bool>> nameConstraint = movie => movie.Name.Contains(filter.Name);
				predicate = predicate.AndAlso(nameConstraint);
			}

			if (filter.GenreIds != null && filter.GenreIds.Length != 0)
			{
				Expression<Func<Movie, bool>> genreConstraint = movie =>
					filter.GenreIds.All(genreId => movie.Genres!.Any(g => g.Id == genreId));

				predicate = predicate.AndAlso(genreConstraint);
			}

			return predicate;
		}

		public static Expression<Func<Review, bool>>? GetPredicate(this ReviewFilter filter)
		{
			Expression<Func<Review, bool>>? predicate = null;

			if (filter.MovieId != null)
			{
				Expression<Func<Review, bool>> movieConstraint = review => review.MovieId == filter.MovieId;
				predicate = predicate.AndAlso(movieConstraint);
			}

			return predicate;
		}

		public static Expression<Func<Rating, bool>>? GetPredicate(this RatingFilter filter)
		{
			Expression<Func<Rating, bool>>? predicate = null;

			if (filter.MovieId != null)
			{
				Expression<Func<Rating, bool>> movieConstraint = review => review.MovieId == filter.MovieId;
				predicate = predicate.AndAlso(movieConstraint);
			}

			if (!string.IsNullOrWhiteSpace(filter.RoleName))
			{
				Expression<Func<Rating, bool>> roleConstraint = review => review.User!.Role!.Name == filter.RoleName;

				predicate = predicate.AndAlso(roleConstraint);
			}

			return predicate;
		}
	}
}
