# EF Core 规约（Specification）模式设计说明

> 目标：抽象可复用、可组合、可测试的查询定义，避免在仓储 / 服务层散落大量 LINQ 细节，提升一致性与可维护性。

---

## 1. 为什么需要 Specification

| 问题         | 传统写法痛点                       | 规约带来价值                                |
| ------------ | ---------------------------------- | ------------------------------------------- |
| 查询逻辑分散 | 多处重复 Where / Include / OrderBy | 通过集中封装减少重复                        |
| 条件组合复杂 | if-else 拼接易出错                 | 组合（And/Or/Not）语义明确                  |
| 可测试性差   | 只能集成测试                       | 规约表达式可单元测试（直接断言 Expression） |
| 变更影响大   | 改一个字段所有调用点检查           | 只改一个 Specification 类                   |
| 动态扩展困难 | 动态拼接表达式可读性差             | 链式或组合式构造                            |

适用场景：

- 可复用的业务过滤（启用状态、所属租户、多租户隔离、软删除过滤）。
- 动态查询（管理后台筛选 + 分页 + 排序）。
- 复杂 Include 图谱封装。
- 查询与变更策略分离（CQRS 中 Query 侧）。

不适用：

- 超简单一次性查询。
- 高度特化的 SQL（复杂窗口函数 / CTE），可直接单独 Repository 方法或 Dapper。

---

## 2. 核心概念

| 名称                                 | 说明                                                      |
| ------------------------------------ | --------------------------------------------------------- |
| ISpecification<T>                    | 定义单个规约：过滤、排序、Include、分页、投影等信息的载体 |
| IProjectionSpecification<T, TResult> | 含 Select/Projection 的规约（DTO/匿名对象映射）           |
| OrderedSpecification                 | 已带排序的规约（防止重复排序）                            |
| CompositeSpecification               | 通过 And / Or / Not 组合多个规约                          |
| SpecificationEvaluator               | 将规约解析并应用到 IQueryable<T> 上的执行器               |

基础接口（拟定）：

```csharp
public interface ISpecification<T>
{
	Expression<Func<T, bool>>? Criteria { get; }
	List<Expression<Func<T, object>>> IncludeExpressions { get; }
	List<string> IncludeStrings { get; }                // 支持 ThenInclude 难表达场景
	List<(Expression<Func<T, object>> KeySelector, bool Desc)> OrderBys { get; }
	Expression<Func<T, object>>? GroupBy { get; }
	int? Skip { get; }
	int? Take { get; }
	bool AsNoTracking { get; }
	bool AsSplitQuery { get; }
	bool IgnoreQueryFilters { get; }
}
```

可选扩展接口：

```csharp
public interface IProjectionSpecification<T, TResult> : ISpecification<T>
{
	Expression<Func<T, TResult>> Selector { get; }
}
```

---

## 3. 规约构造方式

### 3.1 继承式（显式类）

```csharp
public sealed class EnabledProductsSpec : Specification<Product>
{
	public EnabledProductsSpec()
	{
		Where(p => p.IsEnabled);
		OrderBy(p => p.Name);
		AsNoTracking();
	}
}
```

### 3.2 动态构建式（Builder / Fluent）

```csharp
var spec = Specification.For<Product>()
	.Where(p => p.CategoryId == categoryId)
	.WhereIf(!string.IsNullOrEmpty(keyword), p => p.Name.Contains(keyword))
	.Include(p => p.Category)
	.OrderByDescending(p => p.CreatedTime)
	.Page(pageIndex, pageSize);
```

### 3.3 组合

```csharp
var baseSpec = new EnabledProductsSpec();
var priceSpec = Specification.For<Product>().Where(p => p.Price > 100);
var final = baseSpec.And(priceSpec); // 组合表达式树，使用 ExpressionVisitor 合并
```

---

## 4. 表达式合并策略

合并 (And / Or / Not) 时需要参数替换：

```csharp
Expression<Func<T,bool>> CombineAnd(Expression<Func<T,bool>> left, Expression<Func<T,bool>> right)
{
	var param = Expression.Parameter(typeof(T), "x");
	var leftBody = new ReplaceParameterVisitor(left.Parameters[0], param).Visit(left.Body);
	var rightBody = new ReplaceParameterVisitor(right.Parameters[0], param).Visit(right.Body);
	return Expression.Lambda<Func<T,bool>>(Expression.AndAlso(leftBody!, rightBody!), param);
}
```

---

## 5. Include 处理

支持两种：

1. `IncludeExpressions`：`Include(p => p.Category)` / `Include(p => p.Items)`
2. `IncludeStrings`：`"Items.Details"`（复杂 ThenInclude 场景）

Evaluator 应用顺序：

```csharp
foreach(var inc in spec.IncludeExpressions) query = query.Include(inc);
foreach(var str in spec.IncludeStrings)    query = query.Include(str);
```

支持 SplitQuery：`UseSplitQuery()` -> `AsSplitQuery = true`。

---

## 6. 排序 / 分页

排序：列表 `(KeySelector, Desc)`，只应用首个主排序，后续使用 `ThenBy/ThenByDescending`。

分页：

```csharp
if (spec.Skip.HasValue) query = query.Skip(spec.Skip.Value);
if (spec.Take.HasValue) query = query.Take(spec.Take.Value);
```

注：可提供 `Page(pageIndex, pageSize)` 语法糖，实现：`Skip = (index-1)*size; Take = size;`

---

## 7. 投影 (Select)

若实现 `IProjectionSpecification<T,TResult>`：

```csharp
var data = await evaluator.ListAsync(productSpec); // 返回 List<TResult>
```

Evaluator 判断是否存在 Selector：

```csharp
if(spec is IProjectionSpecification<T,TResult> ps)
	query = query.Select(ps.Selector);
```

---

## 8. 上下文应用入口（Evaluator）

```csharp
public class SpecificationEvaluator : ISpecificationEvaluator
{
	public IQueryable<T> GetQuery<T>(IQueryable<T> input, ISpecification<T> spec)
	{
		var query = input;
		if (spec.Criteria != null) query = query.Where(spec.Criteria);
		// Include
		foreach (var inc in spec.IncludeExpressions) query = query.Include(inc);
		foreach (var str in spec.IncludeStrings) query = query.Include(str);
		// Tracking
		if (spec.AsNoTracking) query = query.AsNoTracking();
		if (spec.AsSplitQuery) query = query.AsSplitQuery();
		// Sort
		IOrderedQueryable<T>? ordered = null;
		for(int i=0;i<spec.OrderBys.Count;i++)
		{
			var (key, desc) = spec.OrderBys[i];
			if (i==0)
				ordered = desc ? query.OrderByDescending(key) : query.OrderBy(key);
			else
				ordered = desc ? ordered!.ThenByDescending(key) : ordered!.ThenBy(key);
		}
		if (ordered != null) query = ordered;
		// GroupBy (可选)
		if (spec.GroupBy != null) query = query.GroupBy(spec.GroupBy).SelectMany(g => g);
		// Paging
		if (spec.Skip.HasValue) query = query.Skip(spec.Skip.Value);
		if (spec.Take.HasValue) query = query.Take(spec.Take.Value);
		return query;
	}
}
```

---

## 9. 使用示例

### 9.1 定义规约（含 OR / NOT 示例）

```csharp
public class ProductSearchSpec : Specification<Product>
{
	public ProductSearchSpec(int? categoryId, string? keyword, bool onlyEnabled, int page, int size)
	{
		WhereIf(categoryId.HasValue, p => p.CategoryId == categoryId);
		WhereIf(!string.IsNullOrWhiteSpace(keyword), p => p.Name.Contains(keyword!));
		WhereIf(onlyEnabled, p => p.IsEnabled);
		if (!string.IsNullOrWhiteSpace(keyword))
			WhereOr(p => p.Name == keyword); // OR 精确匹配
		WhereNot(p => p.Name == ""); // 排除空名称
		OrderByDescending(p => p.CreatedTime);
		Page(page, size);
		AsNoTrackingQuery();
	}
}

// 投影规约示例
public sealed class ProductListProjectionSpec : ProjectionSpecification<Product, ProductListProjectionSpec.ProductListItem>
{
	public record ProductListItem(int Id, string Name, int? CategoryId, bool IsEnabled, object CreatedTime);
	public ProductListProjectionSpec(int? orCategoryId, bool onlyEnabled, DateTime? fromTime)
	{
		if (onlyEnabled)
			Where(p => p.IsEnabled);
		if (orCategoryId.HasValue)
			WhereOr(p => p.CategoryId == orCategoryId);
		if (fromTime.HasValue)
			WhereNot(p => (DateTime)p.CreatedTime < fromTime.Value);
		Select(p => new ProductListItem(p.Id, p.Name, p.CategoryId, p.IsEnabled, p.CreatedTime));
		AsNoTrackingQuery();
	}
}
```

### 9.2 仓储调用（普通规约）

```csharp
public async Task<IReadOnlyList<ProductDto>> SearchAsync(ProductSearchSpec spec)
{
	var query = _specEvaluator.GetQuery(_dbContext.Set<Product>(), spec);
	var list = await query.ToListAsync();
	return list.Select(p => new ProductDto{ Id = p.Id, Name = p.Name }).ToList();
}
```

### 9.3 投影规约调用

```csharp
var spec = new ProductListProjectionSpec(orCategoryId: 10, onlyEnabled: false, fromTime: DateTime.UtcNow.AddDays(-7));
var query = _specEvaluator.GetQuery(_dbContext.Set<Product>(), spec);
var list = await query.Select(spec.Selector).ToListAsync();
```

### 9.4 组合示例（And / Or / Not）

```csharp
var enabled = new EnabledProductsSpec();
var hot     = Specification.For<Product>().Where(p => p.SaleCount > 1000);
var enabled = new EnabledProductsSpec();
var highCategory = Specification.For<Product>().Where(p => p.CategoryId == 10);
var final = enabled.And(highCategory); // AND 组合
// Or / Not 已在 Fluent API 内通过 WhereOr / WhereNot 直接构造
```

---

## 10. 可拓展点

| 方向     | 说明                                                             |
| -------- | ---------------------------------------------------------------- |
| 缓存 Key | 根据规约属性生成 Hash，结合二级缓存                              |
| 数据权限 | 在 Specification 基类注入当前用户上下文，自动附加租户 / 组织过滤 |
| 审计     | 在规约里增加 Tag，方便诊断日志输出                               |
| 软删除   | 全局 QueryFilter + spec.IgnoreQueryFilters=true 控制             |
| DTO 投影 | 支持 AutoMapper `ProjectTo`                                      |
| 动态排序 | 通过字符串 + Expression 动态解析 (`Expression.Property`)         |

---

## 11. 设计取舍

| 取舍点               | 方案              | 理由                     |
| -------------------- | ----------------- | ------------------------ |
| 规约是否执行立即查询 | 不                | 保持纯粹：只描述，不执行 |
| 多个 OrderBy         | 按顺序累积 ThenBy | 最接近自然语义           |
| Include 字符串支持   | 保留              | 处理复杂层级             |
| 结果缓存             | 初版不内置        | 避免过早优化             |
| 表达式合并           | ExpressionVisitor | 保持 EF 翻译能力         |

---

## 12. 与 Dapper 的差异

| 能力     | EF Core Specification | Dapper 方案              |
| -------- | --------------------- | ------------------------ |
| 表达式树 | 原生支持              | 需手写翻译或直接 SQL     |
| Include  | 支持导航加载          | 需手写 JOIN / 多查询映射 |
| 组合     | 易于表达              | 需手动拼接 SQL           |
| 投影     | Select / ProjectTo    | 手动 SELECT 列           |

因此：**规约模式优先用于 EF Core 的查询层；Dapper 更适合定制 SQL 性能敏感路径。**

---

## 13. 性能注意事项

1. 规约不要过度组合无意义空 Where。
2. 大量 Include 会导致 N+1 或巨型结果集，必要时拆分查询（可结合 `.AsSplitQuery()`）。
3. 避免在规约中写 `DateTime.Now` 等不可转换表达式，使用参数注入。
4. 分页时需确定排序字段，否则数据库可能返回不稳定结果。
5. GroupBy 后立即 SelectMany 还原，谨慎使用（可单独做 Aggregation 规格）。

---

## 14. 目录建议

```
EntityFrameworkCore/
  Specification/
	ISpecification.cs
	IProjectionSpecification.cs
	Specification.cs          // 基类实现 Fluent API
	CompositeSpecification.cs // And / Or / Not
	SpecificationEvaluator.cs
	Extensions/SpecificationQueryableExtensions.cs
	Samples/                  // 示例规格
```

---

## 15. 后续可实现的步骤清单

1. 定义接口 & 基类骨架。
2. 实现 Expression 合并工具（ParameterReplaceVisitor）。
3. 完成 Evaluator 并单元测试：
   - Include 应用顺序
   - 排序/分页/NoTracking
4. 添加 Fluent API：`WhereIf` / `OrderByDescending` / `Page`
5. 增加 Projection 支持
6. 增加组合 And/Or/Not
7. 增加缓存 Key 生成（可选）
8. 增加示例 + README（当前文件）

---

## 16. 快速对比：直接仓储 vs 规约

```csharp
// 直接仓储写法：
var list = await _dbContext.Products
	.Where(p => p.IsEnabled && p.Price > min && p.CategoryId == cid)
	.Include(p => p.Category)
	.OrderByDescending(p => p.CreatedTime)
	.Skip((page-1)*size).Take(size)
	.AsNoTracking()
	.ToListAsync();

// 规约：
var spec = new ProductSearchSpec(cid, keyword, true, page, size);
var list = await _productRepo.ListAsync(spec);
```

---

## 17. 总结

规约模式把“查询意图”抽象为第一类对象，支持复用、组合、测试与演进，是中大型项目中消除重复 LINQ 的有效手段。初版无需一次做全，可从：`过滤 + Include + 排序 + 分页 + NoTracking` 核心能力开始，逐步迭代。

> 下一步：根据上面第 15 条清单创建代码骨架。
