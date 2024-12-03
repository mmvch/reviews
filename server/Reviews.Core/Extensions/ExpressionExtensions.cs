using System.Linq.Expressions;

namespace Reviews.Core.Extensions
{
	public static class ExpressionExtensions
	{
		public static Expression<Func<TEntity, bool>> AndAlso<TEntity>(
			this Expression<Func<TEntity, bool>>? left, Expression<Func<TEntity, bool>> right)
		{
			if (left == null)
			{
				return right;
			}

			ParameterExpression parameter = Expression.Parameter(typeof(TEntity));

			Expression<Func<TEntity, bool>> combined = Expression.Lambda<Func<TEntity, bool>>(
				Expression.AndAlso(
					Expression.Invoke(left, parameter),
					Expression.Invoke(right, parameter)
				),
				parameter
			);

			return combined;
		}
	}
}
