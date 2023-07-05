namespace WebCommons.Utils
{
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
    }
}