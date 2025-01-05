namespace System.ComponentModel.DataAnnotations
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class TooltipAttribute : Attribute
    {
        public string Tip { get; set; }

        public TooltipAttribute(string tip)
        {
            this.Tip = tip;
        }
    }
}
