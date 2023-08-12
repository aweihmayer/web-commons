namespace WebCommons.Utils
{
    public static class EnumUtils
    {
        /// <summary>
        /// Gets the int values of an enum as an object array.
        /// </summary>
        public static object[] GetValuesAsObject(Type enumType)
        {
            int[] enumValues = (int[]) Enum.GetValues(enumType);
            return enumValues.Select(v => (object)v).ToArray();
        }

        public static int[] ToEnumValueArray(this Type type)
        {
            return (int[])Enum.GetValues(type);
        }

        public static Dictionary<string, int> ToEnumMap(this Type type, CharacterCasing casing = CharacterCasing.Normal)
        {
            int[] values = (int[])Enum.GetValues(type);
            return values.ToDictionary(
                v => Enum.GetName(type, v).ToCasing(casing),
                v => v);
        }

        public static Dictionary<string, int> ToEnumConstMap(this Type type)
        {
            return type.ToEnumMap(CharacterCasing.Upper);
        }
    }
}