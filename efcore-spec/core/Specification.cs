using System.Linq.Expressions;

namespace ApiTemplate.Infra.EntityFrameworkCore.Specification.Core;

/// <summary>
/// 规约抽象基类：提供 Fluent API 构造能力。
/// </summary>
public abstract class Specification<T> : ISpecification<T>
{
    private Expression<Func<T, bool>> _criteria;
    private readonly List<Expression<Func<T, object>>> _includes = new();
    private readonly List<string> _includeStrings = new();
    private readonly List<(Expression<Func<T, object>> KeySelector, bool Desc)> _orderBys = new();

    public Expression<Func<T, bool>> Criteria => _criteria;
    public List<Expression<Func<T, object>>> IncludeExpressions => _includes;
    public List<string> IncludeStrings => _includeStrings;
    public List<(Expression<Func<T, object>> KeySelector, bool Desc)> OrderBys => _orderBys;
    public Expression<Func<T, object>> GroupBy { get; private set; }
    public int? Skip { get; private set; }
    public int? Take { get; private set; }
    public bool AsNoTracking { get; private set; }
    public bool AsSplitQuery { get; private set; }
    public bool IgnoreQueryFilters { get; private set; }

    protected void Where(Expression<Func<T, bool>> predicate)
    {
        if (_criteria == null) _criteria = predicate; else _criteria = _criteria.And(predicate);
    }
    protected void WhereIf(bool condition, Expression<Func<T, bool>> predicate)
    {
        if (condition) Where(predicate);
    }
    /// <summary>
    /// 通过 OR 追加条件 ( (A) OR (B) )，如果当前为空则直接赋值。
    /// </summary>
    protected void WhereOr(Expression<Func<T, bool>> predicate)
    {
        if (_criteria == null) _criteria = predicate; else _criteria = _criteria.Or(predicate);
    }
    /// <summary>
    /// 通过 AND NOT 追加条件 ( A AND NOT(B) )，如果当前为空则为 NOT(B)。
    /// </summary>
    protected void WhereNot(Expression<Func<T, bool>> predicate)
    {
        var notExpr = predicate.Not();
        if (_criteria == null) _criteria = notExpr; else _criteria = _criteria.And(notExpr);
    }

    protected void Include(Expression<Func<T, object>> includeExpression) => _includes.Add(includeExpression);
    protected void Include(string includeString) => _includeStrings.Add(includeString);
    protected void OrderBy(Expression<Func<T, object>> key) => _orderBys.Add((key, false));
    protected void OrderByDescending(Expression<Func<T, object>> key) => _orderBys.Add((key, true));
    protected void GroupByExpr(Expression<Func<T, object>> key) => GroupBy = key;
    protected void Page(int pageIndex, int pageSize)
    {
        if (pageIndex < 1) pageIndex = 1;
        if (pageSize < 1) pageSize = 10;
        Skip = (pageIndex - 1) * pageSize;
        Take = pageSize;
    }
    protected void ApplyPaging(int skip, int take)
    {
        Skip = skip < 0 ? 0 : skip;
        Take = take;
    }
    protected void AsNoTrackingQuery() => AsNoTracking = true;
    protected void AsSplitQueryMode() => AsSplitQuery = true;
    protected void IgnoreGlobalFilters() => IgnoreQueryFilters = true;
}

/// <summary>
/// 投影规约基类。
/// </summary>
public abstract class ProjectionSpecification<T, TResult> : Specification<T>, IProjectionSpecification<T, TResult>
{
    public Expression<Func<T, TResult>> Selector { get; private set; } = default!;
    protected void Select(Expression<Func<T, TResult>> selector) => Selector = selector;
}

internal static class SpecificationExpressionExtensions
{
    public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> left, Expression<Func<T, bool>> right)
    {
        var param = Expression.Parameter(typeof(T), "x");
        var leftBody = new ReplaceParameterVisitor(left.Parameters[0], param).Visit(left.Body)!;
        var rightBody = new ReplaceParameterVisitor(right.Parameters[0], param).Visit(right.Body)!;
        return Expression.Lambda<Func<T, bool>>(Expression.AndAlso(leftBody, rightBody), param);
    }
    public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> left, Expression<Func<T, bool>> right)
    {
        var param = Expression.Parameter(typeof(T), "x");
        var leftBody = new ReplaceParameterVisitor(left.Parameters[0], param).Visit(left.Body)!;
        var rightBody = new ReplaceParameterVisitor(right.Parameters[0], param).Visit(right.Body)!;
        return Expression.Lambda<Func<T, bool>>(Expression.OrElse(leftBody, rightBody), param);
    }
    public static Expression<Func<T, bool>> Not<T>(this Expression<Func<T, bool>> expr)
    {
        var param = Expression.Parameter(typeof(T), "x");
        var body = new ReplaceParameterVisitor(expr.Parameters[0], param).Visit(expr.Body)!;
        return Expression.Lambda<Func<T, bool>>(Expression.Not(body), param);
    }
}

internal sealed class ReplaceParameterVisitor : ExpressionVisitor
{
    private readonly ParameterExpression _source;
    private readonly ParameterExpression _target;
    public ReplaceParameterVisitor(ParameterExpression source, ParameterExpression target)
    {
        _source = source; _target = target;
    }
    protected override Expression VisitParameter(ParameterExpression node)
        => node == _source ? _target : base.VisitParameter(node);
}
