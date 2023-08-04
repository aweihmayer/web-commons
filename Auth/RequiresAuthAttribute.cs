namespace MartialMap.Controllers
{
    /// <summary>
    /// Validates that a user is authenticated before executing the endpoint.
    /// </summary>
    [AttributeUsage(AttributeTargets.Method)]
    public class RequiresAuthAttribute : Attribute
	{
		public RequiresAuthAttribute() { }
	}
}