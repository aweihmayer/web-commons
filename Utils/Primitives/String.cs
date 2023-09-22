using Microsoft.VisualBasic;
using Newtonsoft.Json.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace System
{
    public enum CharacterCasing { Lower, Normal, Upper, UpperSnakeCase }

    public static class StringUtils
    {
        public static string ToCasing(this string str, CharacterCasing casing)
        {
            switch (casing) {
                case CharacterCasing.Lower:
                    return str.ToLower();
                case CharacterCasing.Upper:
                    return str.ToUpper();
                case CharacterCasing.UpperSnakeCase:
                    var chars = str.ToCharArray();
                    string newStr = "";

                    for (int i = 0; i < chars.Length; i++) {
                        var c = chars[i];
                        newStr += (i != 0 && Char.IsUpper(c) && Char.IsLower(chars[i - 1]))
                            ? "_" + c
                            : c.ToString();
                    }

                    return newStr.ToUpper();
                default:
                    return str;
            }
        }

        /// <summary>
        /// Transforms the first char of a string to lower case.
        /// </summary>
        public static string FirstCharToLowerCase(this string str)
        {
            return char.ToLower(str[0]) + str.Substring(1);
        }

        /// <summary>
        /// Transforms the first char of a string to upper case.
        /// </summary>
        public static string FirstCharToUpperCase(this string str)
        {
            return char.ToUpper(str[0]) + str.Substring(1);
        }

        /// <summary>
        /// Transforms a string into a slug.
        /// </summary>
        public static string ToSlug(this string str)
        {
            str = str.Trim().ToLower();
            str = str.RemoveAccents();
            str = Regex.Replace(str, @"[^a-z0-9\s-]", ""); // Invalid chars
            str = Regex.Replace(str, @"\s+", " "); // Convert multiple spaces into one space   
            return Regex.Replace(str, @"\s", "-"); // Hyphens   
        }

        /// <summary>
        /// Removes accents from a string, leaving only plain letters.
        /// </summary>
        public static string RemoveAccents(this string str)
		{
            Dictionary<char, List<char>> replacements = new() {
                { 'e', new List<char> { 'é', 'è', 'ê' } }
            };

            Char[] chars = str.ToCharArray();
            for(int i = 0; i < chars.Length; i++) {
                char replacement = replacements.Where(r => r.Value.Contains(chars[i])).Select(r => r.Key).FirstOrDefault();
                if (replacement == 0) { continue; }
                chars[i] = Char.IsUpper(chars[i]) ? Char.ToUpper(replacement) : replacement;
            }
            
            return new string(chars);
        }

        /// <summary>
        /// Decodes a base64 string.
        /// </summary>
        public static string DecodeBase64(this string str)
        {
            byte[] bytes = Convert.FromBase64String(str);
            return Encoding.UTF8.GetString(bytes);
        }

        /// <summary>
        /// Encodes a base64 string.
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string EncodeBase64(this string str)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(str);
            return Convert.ToBase64String(bytes);
        }

        /// <summary>
        /// Replaces key pair values in a string.
        /// </summary>
        public static string Replace(this string str, Dictionary<string, string> replacements)
        {
            foreach (var v in replacements) {
                str = str.Replace(v.Key, v.Value.ToString());
            }

            return str;
        }
    }
}