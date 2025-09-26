using System.Linq.Expressions;

namespace ApiTemplate.Infra.EntityFrameworkCore.Specification.Core;

/// <summary>
/// 带投影（Select）的规约。
/// </summary>
public interface IProjectionSpecification<T, TResult> : ISpecification<T>
{
    Expression<Func<T, TResult>> Selector { get; }
}
