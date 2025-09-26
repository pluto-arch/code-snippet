using System.Linq.Expressions;

namespace ApiTemplate.Infra.EntityFrameworkCore.Specification.Core;

/// <summary>
/// 基础规约接口：描述一个针对 <typeparamref name="T"/> 的查询意图。
/// 只负责“描述”，不做执行（无副作用）。
/// </summary>
public interface ISpecification<T>
{
    Expression<Func<T, bool>> Criteria { get; }
    List<Expression<Func<T, object>>> IncludeExpressions { get; }
    List<string> IncludeStrings { get; }
    List<(Expression<Func<T, object>> KeySelector, bool Desc)> OrderBys { get; }
    Expression<Func<T, object>> GroupBy { get; }
    int? Skip { get; }
    int? Take { get; }
    bool AsNoTracking { get; }
    bool AsSplitQuery { get; }
    bool IgnoreQueryFilters { get; }
}
