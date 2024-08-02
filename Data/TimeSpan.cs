namespace System
{
    public static class TimeUtils {
        public const int WEEK_IN_SECONDS = 604800;
        public const int DAY_IN_SECONDS = 86400;
        public const int DAY_IN_MS = 86400000;
    }

    public static class TimeSpanExtensions
    {
        /// <summary>
        /// Determines if a TimeSpan is between two durations.
        /// </summary>
        public static bool IsBetween(this TimeSpan time, TimeSpan a, TimeSpan b)
        {
            return (a > b)
                ? (time >= b && time <= a)
                : (time >= a && time <= b);
        }
    }
}