using ApiTemplate.Domain.ProductDomain;
using ApiTemplate.Infra.EntityFrameworkCore.Specification.Core;

namespace ApiTemplate.Infra.EntityFrameworkCore.Specification.Samples;

/// <summary>
/// 产品列表投影示例：只取必要字段，减少 SELECT 列。
/// 演示组合：(IsEnabled OR 指定分类) AND NOT(过期时间早于 fromTime)。
/// </summary>
public class ProductListProjectionSpec : ProjectionSpecification<Product, ProductListProjectionSpec.ProductListItem>
{
    public record ProductListItem(int Id, string Name, int? CategoryId, bool IsEnabled, object CreatedTime);

    public ProductListProjectionSpec(int? orCategoryId, bool onlyEnabled, DateTime? fromTime)
    {
        // 首先：根据 enabled/分类做 OR 组合
        if (onlyEnabled)
            Where(p => p.IsEnabled); // 初始条件
        if (orCategoryId.HasValue)
            WhereOr(p => p.CategoryId == orCategoryId); // (IsEnabled OR CategoryId == X)

        // NOT 条件：排除创建时间早于 fromTime 的记录
        if (fromTime.HasValue)
            WhereNot(p => (DateTime)p.CreatedTime < fromTime.Value);

        Select(p => new ProductListItem(p.Id, p.Name, p.CategoryId, p.IsEnabled, p.CreatedTime));
        AsNoTrackingQuery();
    }
}
