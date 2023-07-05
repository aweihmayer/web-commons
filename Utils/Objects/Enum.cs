namespace WebCommons.Utils
{
    public static class EnumUtils
    {
        /// <summary>
        /// Transforms the enum to a map.
        /// </summary>
        /// <returns>A map as enum name => enum int.</returns>
        public static Dictionary<string, int> ToDictionary(Type enumType)
        {
            Dictionary<string, int> map = new Dictionary<string, int>();
            int[] values = (int[]) Enum.GetValues(enumType);

            foreach (int v in values) {
                map.Add(Enum.GetName(enumType, v), v);
            }

            return map;
        }

        /// <summary>
        /// Gets the int values of an enum as an object array.
        /// </summary>
        public static object[] GetValuesAsObject(Type enumType)
        {
            int[] enumValues = (int[]) Enum.GetValues(enumType);
            return enumValues.Select(v => (object)v).ToArray();
        }
    }
}