namespace System
{
    public static class DateTimeUtils {
        public const int WEEK_IN_SECONDS = 604800;
        public const int DAY_IN_SECONDS = 86400;
    }

    public static class DateTimeExtensions
    {
        /// <summary>
        /// Gets the date of the previous occurence of a day.
        /// </summary>
        public static DateTime GetPreviousDay(this DateTime date, DayOfWeek day)
        {
            int currentDay = (int)date.DayOfWeek;
            int targetDay = (int)day;
            return date.AddDays(targetDay - currentDay);
        }

        public static DateTime GetFirstDayOfMonth(this DateTime date)
        {
            return new DateTime(date.Year, date.Month, 1, 0, 0, 0, date.Kind);
        }
    }
}