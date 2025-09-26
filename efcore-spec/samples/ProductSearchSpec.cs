using ApiTemplate.Domain.ProductDomain;
using ApiTemplate.Infra.EntityFrameworkCore.Specification.Core;

namespace ApiTemplate.Infra.EntityFrameworkCore.Specification.Samples;

public sealed class ProductSearchSpec : Specification<Product>
{
    public ProductSearchSpec(int? categoryId, string keyword, bool onlyEnabled, int page, int size)
    {
        // 基础过滤
        WhereIf(categoryId.HasValue, p => p.CategoryId == categoryId);
        WhereIf(!string.IsNullOrWhiteSpace(keyword), p => p.Name.Contains(keyword!));

        // 如果 onlyEnabled=true 追加启用条件；示例：与其它条件 AND
        WhereIf(onlyEnabled, p => p.IsEnabled);

        // 示例：展示 OR 的使用（如果关键字存在，再额外 OR 一个 Name == keyword 的精准匹配）
        if (!string.IsNullOrWhiteSpace(keyword))
            WhereOr(p => p.Name == keyword);

        // 示例：NOT（排除 Name 为空字符串的记录）
        WhereNot(p => p.Name == "");

        OrderByDescending(p => p.CreatedTime);
        Page(page, size);
        AsNoTrackingQuery();
    }
}
