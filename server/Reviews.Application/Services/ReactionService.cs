using Reviews.Application.Services.Interfaces;
using Reviews.Core.Exceptions;
using Reviews.Core.Models;
using Reviews.Persistence.Repositories.Interfaces;
using System.Net;

namespace Reviews.Application.Services
{
	public class ReactionService : IReactionService
	{
		private readonly IReactionRepository _reactionRepository;
		private readonly IReviewRepository _reviewRepository;

		public ReactionService(IReactionRepository reactionRepository, IReviewRepository reviewRepository)
		{
			_reactionRepository = reactionRepository;
			_reviewRepository = reviewRepository;
		}

		public async Task<bool?> GetAsync(Guid reviewId, Guid userId)
		{
			ReviewReaction? reaction = await _reactionRepository.GetAsync(reviewId, userId);
			return reaction?.IsLiked;
		}

		public async Task CreateAsync(Guid reviewId, Guid userId, bool value)
		{
			_ = await _reviewRepository.GetByIdAsync(reviewId)
					?? throw new ServiceException("Review not found", HttpStatusCode.NotFound);

			if (await _reactionRepository.GetAsync(reviewId, userId) != null)
			{
				throw new ServiceException("You can create only one reaction for review", HttpStatusCode.Conflict);
			}

			ReviewReaction reaction = new()
			{
				UserId = userId,
				ReviewId = reviewId,
				IsLiked = value
			};

			await _reactionRepository.CreateAsync(reaction);
		}

		public async Task UpdateAsync(Guid reviewId, Guid userId, bool value)
		{
			ReviewReaction reaction = await _reactionRepository.GetAsync(reviewId, userId)
				?? throw new ServiceException("Reaction not found", HttpStatusCode.NotFound);

			reaction.IsLiked = value;

			await _reactionRepository.UpdateAsync(reaction);
		}

		public async Task DeleteAsync(Guid reviewId, Guid userId)
		{
			ReviewReaction reaction = await _reactionRepository.GetAsync(reviewId, userId)
				?? throw new ServiceException("Reaction not found", HttpStatusCode.NotFound);

			await _reactionRepository.DeleteAsync(reaction);
		}
	}
}
