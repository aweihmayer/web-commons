namespace System
{
    public static class DateTimeExtensions
    {
        /// <summary>
        /// Gets the date of the previous occurence of a day.
        /// </summary>
        public static DateTimeOffset GetPreviousDay(this DateTimeOffset date, DayOfWeek day)
        {
            int currentDay = (int)date.DayOfWeek;
            int targetDay = (int)day;
            return date.AddDays(targetDay - currentDay);
        }

        public static DateTimeOffset GetFirstDayOfMonth(this DateTimeOffset date)
        {
            return new DateTimeOffset(date.Year, date.Month, 1, 0, 0, 0, date.Offset);
        }
    }
}