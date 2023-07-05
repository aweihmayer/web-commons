namespace WebCommons.Internationalization
{
    public class I18n
    {
        public string Locale { get; set; } = "en";

        public I18n() { }

        public I18n(string locale) { Locale = locale; }

        #region Replace placeholders in a value

        public string Val(string value)
        {
            return value;
        }

        public string Val(string value, Dictionary<string, object> replacements)
        {
            foreach (KeyValuePair<string, object> r in replacements) {
                value = value.Replace("{" + r.Key + "}", r.Value.ToString());
            }

            return value;
        }

        public string Val(string value, IEnumerable<string> replacements)
        {
            string[] replacementsArr = replacements.ToArray();
            for (int i = 0; i < replacementsArr.Length; i++) {
                value = value.Replace("{" + i + "}", replacementsArr[i].ToString());
            }

            return value;
        }

        #endregion

        #region Pick a plural or singular value

        public string Val(IEnumerable<string> values)
        {
            return values.ToArray()[0];
        }

        // Replacements only

        public string Val(IEnumerable<string> values, Dictionary<string, object> replacements)
        {
            return Val(values, replacements, false);
        }

        public string Val(IEnumerable<string> values, IEnumerable<string> replacements)
        {
            return Val(values, replacements, false);
        }

        // Plural selector only

        public string Val(IEnumerable<string> values, bool plural)
        {
            return Val(values, Array.Empty<string>(), plural);
        }

        public string Val(IEnumerable<string> values, double plural)
        {
            return Val(values, Array.Empty<string>(), plural);
        }

        // Replacements and plural selector

        public string Val(IEnumerable<string> values, Dictionary<string, object> replacements, bool plural)
        {
            string[] arr = values.ToArray();
            string value = plural ? arr[1] : arr[0];
            return Val(value, replacements);
        }

        public string Val(IEnumerable<string> values, Dictionary<string, object> replacements, double plural)
        {
            return Val(values, replacements, (plural > 1));
        }

        public string Val(IEnumerable<string> values, IEnumerable<string> replacements, bool plural)
        {
            string[] arr = values.ToArray();
            string value = plural ? arr[1] : arr[0];
            return Val(value, replacements);
        }

        public string Val(IEnumerable<string> values, IEnumerable<string> replacements, double plural)
        {
            return Val(values, replacements, (plural > 1));
        }

        #endregion

        #region Localized value

        private string Localize(Dictionary<string, string> values)
        {
            return values[this.Locale];
        }

        private string[] Localize(Dictionary<string, string[]> values)
        {
            return values[this.Locale];
        }

        // Locale selector only

        public string Val(Dictionary<string, string> values)
        {
            return Val(Localize(values));
        }

        // Locale selector and replacements

        public string Val(Dictionary<string, string> values, Dictionary<string, object> replacements)
        {
            return Val(Localize(values), replacements);
        }

        public string Val(Dictionary<string, string> values, IEnumerable<string> replacements)
        {
            return Val(Localize(values), replacements);
        }

        // Locale selector, replacements and plural selector

        public string Val(Dictionary<string, string[]> values, Dictionary<string, object> replacements, bool plural)
        {
            return Val(Localize(values), replacements, plural);
        }

        public string Val(Dictionary<string, string[]> values, Dictionary<string, object> replacements, double plural)
        {
            return Val(Localize(values), replacements, plural);
        }

        public string Val(Dictionary<string, string[]> values, IEnumerable<string> replacements, bool plural)
        {
            return Val(Localize(values), replacements, plural);
        }

        public string Val(Dictionary<string, string[]> values, IEnumerable<string> replacements, double plural)
        {
            return Val(Localize(values), replacements, plural);
        }

        #endregion
    }
}