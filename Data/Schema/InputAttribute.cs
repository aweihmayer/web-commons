namespace System.ComponentModel.DataAnnotations
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class InputAttribute : Attribute
    {
        public const string IMAGE = "image";
        public const string SELECT = "select";
        public const string TAG_SEARCH = "tag-search";
        public const string TEXTAREA = "textarea";
        public const string PASSWORD = "password";

        public string Input { get; set; }

        public InputAttribute(string name)
        {
            this.Input = name;
        }
    }
}
