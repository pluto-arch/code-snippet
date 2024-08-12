public class DateRangeProcessor
{
    public static List<DateRange> Process(DateRange initRange, List<DateRange> subRange)
    {
        var matched = subRange
            .Where(x => x.Start.IsIn(initRange.Start, initRange.End) || x.End.IsIn(initRange.Start, initRange.End))
            .OrderBy(x => x.Start)
            .ToList();

        var result = new List<DateRange>();
        DateTime currentStart = initRange.Start;
        foreach (var range in matched)
        {
            if (currentStart < range.Start)
            {
                result.Add(new DateRange
                {
                    Start = currentStart,
                    End = range.Start,
                    Color = Color.Green
                });
            }
            result.Add(range);
            currentStart = range.End;
        }
        if (currentStart < initRange.End)
        {
            result.Add(new DateRange
            {
                Start = currentStart,
                End = initRange.End,
                Color = Color.Green
            });
        }

        // 合并 initRange 和 result
        var finalResult = new List<DateRange>();
        DateTime finalStart = initRange.Start;
        foreach (var range in result)
        {
            if (range.Start < initRange.Start)
            {
                range.Start = initRange.Start;
            }
            if (range.End > initRange.End)
            {
                range.End = initRange.End;
            }
            if (finalStart < range.Start)
            {
                finalResult.Add(new DateRange
                {
                    Start = finalStart,
                    End = range.Start,
                    Color = Color.Green
                });
            }
            finalResult.Add(range);
            finalStart = range.End;
        }
        if (finalStart < initRange.End)
        {
            finalResult.Add(new DateRange
            {
                Start = finalStart,
                End = initRange.End,
                Color = Color.Green
            });
        }

        return finalResult;
    }
}
