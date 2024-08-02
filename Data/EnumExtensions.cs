namespace WebCommons.Utils
{
    public static class EnumUtils
    {
        /// <summary>
        /// Gets the int values of an enum as an object array.
        /// </summary>
        public static object[] GetEnumsAsObjects(this Type type)
        {
            return type.GetEnumsAsIntegers().Select(v => (object)v).ToArray();
        }

        /// <summary>
        /// Gets the values of an enum as an int array.
        /// </summary>
        public static int[] GetEnumsAsIntegers(this Type type)
        {
            return (int[])Enum.GetValues(type);
        }

        /// <summary>
        /// Gets the values of an enum as a map where the key is the name in upper snake case and the value is an object integer.
        /// </summary>
        public static Dictionary<string, object> GetEnumsAsConstantMap(this Type type)
        {
            return type.GetEnumsAsObjects().ToDictionary(
                v => Enum.GetName(type, v).ToUpperSnakeCase(),
                v => v);
        }
    }
}