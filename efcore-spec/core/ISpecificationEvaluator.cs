using Microsoft.EntityFrameworkCore;

namespace ApiTemplate.Infra.EntityFrameworkCore.Specification.Core;

public interface ISpecificationEvaluator
{
    IQueryable<T> GetQuery<T>(IQueryable<T> inputQuery, ISpecification<T> specification)
        where T : class;
}

public class SpecificationEvaluator : ISpecificationEvaluator
{
    public static ISpecificationEvaluator Default { get; } = new SpecificationEvaluator();

    public IQueryable<T> GetQuery<T>(IQueryable<T> inputQuery, ISpecification<T> specification)
         where T : class
    {
        var query = inputQuery;
        if (specification.Criteria != null)
            query = query.Where(specification.Criteria);

        // Include
        foreach (var inc in specification.IncludeExpressions)
            query = query.Include(inc);
        foreach (var incStr in specification.IncludeStrings)
            query = query.Include(incStr);

        if (specification.IgnoreQueryFilters)
            query = query.IgnoreQueryFilters();
        if (specification.AsNoTracking)
            query = query.AsNoTracking();
        if (specification.AsSplitQuery)
            query = query.AsSplitQuery();

        // Order
        IOrderedQueryable<T> ordered = null;
        for (int i = 0; i < specification.OrderBys.Count; i++)
        {
            var (key, desc) = specification.OrderBys[i];
            if (i == 0)
                ordered = desc ? query.OrderByDescending(key) : query.OrderBy(key);
            else
                ordered = desc ? ordered!.ThenByDescending(key) : ordered!.ThenBy(key);
        }
        if (ordered != null) query = ordered;

        // GroupBy (flatten back)
        if (specification.GroupBy != null)
        {
            query = query.GroupBy(specification.GroupBy).SelectMany(g => g);
        }

        // Paging
        if (specification.Skip.HasValue) query = query.Skip(specification.Skip.Value);
        if (specification.Take.HasValue) query = query.Take(specification.Take.Value);

        return query;
    }
}
