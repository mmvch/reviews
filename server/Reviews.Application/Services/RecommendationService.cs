using Reviews.Application.Services.Interfaces;
using Reviews.Core.DTO;
using Reviews.Core.DTO.Filters;
using Reviews.Core.Extensions;
using Reviews.Core.Models;
using Reviews.Persistence.Repositories.Interfaces;
using System.Collections.Concurrent;
using System.Linq.Expressions;

namespace Reviews.Application.Services
{
	public class RecommendationService : IRecommendationService
	{
		private const int PositivePoint = 4;
		private const int AveragePoint = 3;

		private const double PopularFilmMinScale = 1;
		private const double PopularFilmGap = 0.2;

		private const double PopularGenreMinScale = 1.5;
		private const double PopularGenreGap = 0.5;

		private const double RatingSimilarityImpact = 0.7;
		private const double ReactionSimilarityImpact = 0.3;

		private readonly IMovieRepository _movieRepository;
		private readonly IGenreRepository _genreRepository;
		private readonly IRatingRepository _ratingRepository;
		private readonly IReviewRepository _reviewRepository;
		private readonly IReactionRepository _reactionRepository;

		public RecommendationService(IMovieRepository movieRepository, IGenreRepository genreRepository,
			IRatingRepository ratingRepository, IReviewRepository reviewRepository, IReactionRepository reactionRepository)
		{
			_movieRepository = movieRepository;
			_genreRepository = genreRepository;
			_ratingRepository = ratingRepository;
			_reviewRepository = reviewRepository;
			_reactionRepository = reactionRepository;
		}

		public async Task<PartialData<(Movie, int)>> GetRecommendationsAsync(Guid targetUserId, MovieFilter filter)
		{
			Expression<Func<Movie, bool>>? movieRestriction = filter.GetPredicate();
			ConcurrentDictionary<Guid, double> movieScores = [];

			await AdjustScoresByRatingsAsync(movieScores, targetUserId, movieRestriction);
			await AdjustScoresByReviewsAsync(movieScores, movieRestriction);
			await AdjustScoresByGenresAsync(movieScores, targetUserId, movieRestriction);

			return await GenerateResultAsync(movieScores, filter);
		}

		private async Task<PartialData<(Movie Movie, int Score)>> GenerateResultAsync(ConcurrentDictionary<Guid, double> movieScores, MovieFilter filter)
		{
			static int ScaleToRange(double oldValue, double oldMin, double oldMax, double newMin, double newMax)
			{
				if (oldMin == oldMax)
				{
					return (int)newMax;
				}

				return (int)(newMin + (oldValue - oldMin) * (newMax - newMin) / (oldMax - oldMin));
			}

			int totalAmount = movieScores.Count;

			if (totalAmount == 0)
			{
				return new PartialData<(Movie, int)>
				{
					TotalAmount = 0
				};
			}

			double maxValue = movieScores.Values.Max();
			double minValue = movieScores.Values.Min();

			var partialMovieScores = movieScores
				.OrderByDescending(ms => ms.Value)
				.Skip(filter.CurrentPage * filter.PageSize ?? 0)
				.Take(filter.PageSize ?? totalAmount)
				.ToDictionary(ms => ms.Key, ms => ScaleToRange(ms.Value, minValue, maxValue, 1, 100));

			Guid[] movieIds = partialMovieScores
				.Select(ms => ms.Key)
				.ToArray();

			Movie[] movies = await _movieRepository.GetFilteredListAsync(movieIds);

			PartialData<(Movie, int)> result = new()
			{
				Data = movieIds.Join(movies, id => id, movie => movie.Id, (id, movie) => (movie, partialMovieScores[id])),
				TotalAmount = totalAmount
			};

			return result;
		}

		private async Task AdjustScoresByGenresAsync(ConcurrentDictionary<Guid, double> movieScores,
			Guid targetUserId, Expression<Func<Movie, bool>>? movieRestriction)
		{
			var movies = await _movieRepository.GetSimpledListAsync(movieRestriction);
			var favoriteGenres = await _genreRepository.GetFavoriteGenreIdsAsync(targetUserId, PositivePoint);

			int maxCount = favoriteGenres.Count > 0 ? favoriteGenres.MaxBy(fg => fg.Value).Value : 0;

			if (maxCount == 0)
			{
				return;
			}

			var movieGenres = movies
				.Select(movie => new SimpleMovie
				{
					Id = movie.Id,
					GenreIds = favoriteGenres.Select(g => g.Key).Intersect(movie.GenreIds).ToArray()
				})
				.Where(result => result.GenreIds.Length > 0)
				.ToArray();

			Parallel.ForEach(movieGenres, movieGenre =>
			{
				if (movieScores.TryGetValue(movieGenre.Id, out double currentValue))
				{
					foreach (var GenreId in movieGenre.GenreIds)
					{
						double scale = PopularGenreMinScale + favoriteGenres[GenreId] / (double)maxCount * PopularGenreGap;
						double newValue = currentValue >= 0 ? currentValue * scale : currentValue / scale;
						movieScores.TryUpdate(movieGenre.Id, newValue, currentValue);
					}
				}
			});
		}

		private async Task AdjustScoresByReviewsAsync(ConcurrentDictionary<Guid, double> movieScores,
			Expression<Func<Movie, bool>>? movieRestriction)
		{
			MoviePopularity[] movies = await GetMoviesPopularityAsync(movieRestriction);

			int[] counts = movies.Select(m => Math.Abs(m.Count)).ToArray();
			int maxCount = counts.Length > 0 ? counts.Max() : 0;

			if (maxCount == 0)
			{
				return;
			}

			Parallel.ForEach(movies, movie =>
			{
				if (movieScores.TryGetValue(movie.MovieId, out double currentValue))
				{
					double scale = PopularFilmMinScale + movie.Count / (double)maxCount * PopularFilmGap;
					double newValue = currentValue >= 0 ? currentValue * scale : currentValue / scale;
					movieScores.TryUpdate(movie.MovieId, newValue, currentValue);
				}
			});
		}

		private async Task<MoviePopularity[]> GetMoviesPopularityAsync(Expression<Func<Movie, bool>>? movieRestriction)
		{
			var reviewStacks = await _reviewRepository.GetSimpledStacksAsync(movieRestriction);

			var result = reviewStacks
				.Select(g => new MoviePopularity
				{
					MovieId = g.Key,
					Count = g.Value.Count(a => a.Point > AveragePoint && a.Likes > a.Dislikes ||
											   a.Point < AveragePoint && a.Likes < a.Dislikes) -
							g.Value.Count(a => a.Point > AveragePoint && a.Likes < a.Dislikes ||
											   a.Point < AveragePoint && a.Likes > a.Dislikes)
				})
				.Where(a => a.Count != 0)
				.ToArray();

			return result;
		}

		private async Task AdjustScoresByRatingsAsync(ConcurrentDictionary<Guid, double> movieScores,
			Guid targetUserId, Expression<Func<Movie, bool>>? movieRestriction)
		{
			Dictionary<Guid, double> similarities = await GetSimilarUsersAsync(targetUserId);
			Dictionary<Guid, SimpleRating[]> ratings = await _ratingRepository.GetUnrelatedRatingsAsync(targetUserId, movieRestriction);

			Parallel.ForEach(similarities, similarity =>
			{
				if (ratings.TryGetValue(similarity.Key, out SimpleRating[]? subRatings))
				{
					foreach (var rating in subRatings)
					{
						movieScores.AddOrUpdate(rating.MovieId,
						rating.Point * similarity.Value,
						(key, value) => value + rating.Point * similarity.Value);
					}
				}
			});
		}

		private async Task<Dictionary<Guid, double>> GetSimilarUsersAsync(Guid targetUserId)
		{
			ConcurrentDictionary<Guid, double> similarityScores = [];

			var ratings = await _ratingRepository.GetRelatedRatingsAsync(targetUserId);
			var targetSubRatings = await _ratingRepository.GetForUserAsync(targetUserId);

			Parallel.ForEach(ratings, subRatings =>
			{
				double similarity = PearsonCorrelation(targetSubRatings, subRatings.Value);

				if (similarity != 0)
				{
					similarityScores.TryAdd(subRatings.Key, similarity * RatingSimilarityImpact);
				}
			});

			var reactions = await _reactionRepository.GetRelatedReactionsAsync(targetUserId);
			var targetSubReactions = await _reactionRepository.GetForUserAsync(targetUserId);

			Parallel.ForEach(reactions, subReactions =>
			{
				double similarity = PearsonCorrelation(targetSubReactions, subReactions.Value);

				if (similarity != 0)
				{
					similarityScores.AddOrUpdate(
						subReactions.Key,
						similarity * ReactionSimilarityImpact,
						(key, value) => value + similarity * ReactionSimilarityImpact
					);
				}
			});

			return similarityScores.ToDictionary();
		}

		private static double PearsonCorrelation(SimpleRating[] ratings1, SimpleRating[] ratings2)
		{
			var ratings = ratings2
				.Join(ratings1, r2 => r2.MovieId, r1 => r1.MovieId, (r2, r1) => new
				{
					Point1 = r1.Point,
					Point2 = r2.Point
				})
				.ToArray();

			int n = ratings.Length;

			if (n == 0)
			{
				return 0;
			};

			int minLength = Math.Min(ratings1.Length, ratings2.Length);
			int maxLength = Math.Max(ratings1.Length, ratings2.Length);

			int sum1 = ratings.Sum(r => r.Point1);
			int sum2 = ratings.Sum(r => r.Point2);

			int sum1Sq = ratings.Sum(r => r.Point1 * r.Point1);
			int sum2Sq = ratings.Sum(r => r.Point2 * r.Point2);

			int pSum = ratings.Sum(r => r.Point1 * r.Point2);

			double num = pSum - sum1 * sum2 / (double)n;
			double den = Math.Sqrt((sum1Sq - Math.Pow(sum1, 2) / n) * (sum2Sq - Math.Pow(sum2, 2) / n));

			double result = (den == 0)
				? minLength / (double)maxLength
				: (num / den * minLength / maxLength);

			return result;
		}

		private static double PearsonCorrelation(SimpleReaction[] reactions1, SimpleReaction[] reactions2)
		{
			var ratings = reactions2
				.Join(reactions1, r2 => r2.ReviewId, r1 => r1.ReviewId, (r2, r1) => new
				{
					IsLiked1 = r1.IsLiked ? 1 : 0,
					IsLiked2 = r2.IsLiked ? 1 : 0
				})
				.ToArray();

			int n = ratings.Length;

			if (n == 0)
			{
				return 0;
			};

			int minLength = Math.Min(reactions1.Length, reactions2.Length);
			int maxLength = Math.Max(reactions1.Length, reactions2.Length);

			int sum1 = ratings.Sum(r => r.IsLiked1);
			int sum2 = ratings.Sum(r => r.IsLiked2);

			int sum1Sq = ratings.Sum(r => r.IsLiked1 * r.IsLiked1);
			int sum2Sq = ratings.Sum(r => r.IsLiked2 * r.IsLiked2);

			int pSum = ratings.Sum(r => r.IsLiked1 * r.IsLiked2);

			double num = pSum - sum1 * sum2 / (double)n;
			double den = Math.Sqrt((sum1Sq - Math.Pow(sum1, 2) / n) * (sum2Sq - Math.Pow(sum2, 2) / n));

			double result = (den == 0)
				? minLength / (double)maxLength
				: (num / den * minLength / maxLength);

			return result;
		}
	}
}
