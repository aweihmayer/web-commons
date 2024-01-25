namespace System
{
    public static class DateTimeExtensions
    {
        /// <summary>
        /// Gets the date of the previous occurrence of a day.
        /// </summary>
        public static DateTimeOffset GetPreviousDay(this DateTimeOffset date, DayOfWeek day)
        {
            int currentDay = (int)date.DayOfWeek;
            int targetDay = (int)day;
            return date.AddDays(targetDay - currentDay);
        }

        public static DateTime GetPreviousDay(this DateTime date, DayOfWeek day)
        {
            int currentDay = (int)date.DayOfWeek;
            int targetDay = (int)day;
            return date.AddDays(targetDay - currentDay);
        }

        /// <summary>
        /// Gets the first day of the month.
        /// </summary>
        public static DateTime GetFirstDayOfMonth(this DateTime date)
        {
            return new DateTime(date.Year, date.Month, 1, 0, 0, 0, date.Kind);
        }

        public static DateTimeOffset GetFirstDayOfMonth(this DateTimeOffset date)
        {
            return new DateTimeOffset(date.Year, date.Month, 1, 0, 0, 0, date.Offset);
        }
        
        /// <summary>
        /// Converts to DateOnly
        /// </summary>
        public static DateOnly ToDateOnly(this DateTime date)
        {
            return DateOnly.FromDateTime(date);
        }

        public static DateOnly ToDateOnly(this DateTimeOffset date)
        {
            return DateOnly.FromDateTime(date.DateTime);
        }
    }
}