namespace System.ComponentModel.DataAnnotations
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class FillNameAttribute : Attribute
    {
        public string Name { get; set; }

        public FillNameAttribute(string name)
        {
            this.Name = name;
        }
    }
}
