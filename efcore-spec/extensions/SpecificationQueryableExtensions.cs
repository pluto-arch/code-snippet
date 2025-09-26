using ApiTemplate.Infra.EntityFrameworkCore.Specification.Core;
using Microsoft.EntityFrameworkCore;

namespace ApiTemplate.Infra.EntityFrameworkCore.Specification.Extensions;

public static class SpecificationQueryableExtensions
{
    /// <summary>
    /// 应用规约并返回 IQueryable（延迟执行）。
    /// </summary>
    public static IQueryable<T> ApplySpecification<T>(this IQueryable<T> queryable, ISpecification<T> spec, ISpecificationEvaluator evaluator = null) where T : class
    {
        evaluator ??= SpecificationEvaluator.Default;
        return evaluator.GetQuery(queryable, spec);
    }

    /// <summary>
    /// 根据规约执行 ToListAsync。
    /// </summary>
    public static Task<List<T>> ToListAsync<T>(this IQueryable<T> queryable, ISpecification<T> spec, CancellationToken token = default) where T : class
    {
        return queryable.ApplySpecification(spec).ToListAsync(token);
    }

    /// <summary>
    /// 返回第一个或默认，根据规约。
    /// </summary>
    public static Task<T> FirstOrDefaultAsync<T>(this IQueryable<T> queryable, ISpecification<T> spec, CancellationToken token = default) where T : class
    {
        return queryable.ApplySpecification(spec).FirstOrDefaultAsync(token);
    }

    /// <summary>
    /// 统计符合规约的数量（忽略分页 Take/Skip）。
    /// </summary>
    public static Task<int> CountBySpecAsync<T>(this IQueryable<T> queryable, ISpecification<T> spec, CancellationToken token = default) where T : class
    {
        var evaluator = SpecificationEvaluator.Default;
        var coreQuery = evaluator.GetQuery(queryable, new CountWrapSpecification<T>(spec));
        return coreQuery.CountAsync(token);
    }

    /// <summary>
    /// 包装规约去除分页信息，用于 Count 计算。
    /// </summary>
    private sealed class CountWrapSpecification<T> : ISpecification<T>
        where T : class
    {
        private readonly ISpecification<T> _inner;
        public CountWrapSpecification(ISpecification<T> inner) => _inner = inner;
        public Expression<Func<T, bool>> Criteria => _inner.Criteria;
        public List<Expression<Func<T, object>>> IncludeExpressions => _inner.IncludeExpressions;
        public List<string> IncludeStrings => _inner.IncludeStrings;
        public List<(Expression<Func<T, object>> KeySelector, bool Desc)> OrderBys => _inner.OrderBys;
        public Expression<Func<T, object>> GroupBy => _inner.GroupBy;
        public int? Skip => null;
        public int? Take => null;
        public bool AsNoTracking => _inner.AsNoTracking;
        public bool AsSplitQuery => _inner.AsSplitQuery;
        public bool IgnoreQueryFilters => _inner.IgnoreQueryFilters;
    }
}
