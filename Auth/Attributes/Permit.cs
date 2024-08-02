namespace WebCommons.Auth
{
    /// <summary>
    /// Defines the required permissions for executing an endpoint.
    /// If none are given, permits any signed-in user, but not anonymous guests.
    /// </summary>
    [AttributeUsage(AttributeTargets.Method)]
    public class PermitAttribute : Attribute
	{
        /// <summary>
        /// See <see cref="WebCommons.Auth.Filters.IPermissionsFilter.ValidatePermissions(Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext, string[])">permissions filter</see>.
        /// </summary>
        public string[] Permissions { get; set; }

		public PermitAttribute(params string[] permissions) {
            this.Permissions = permissions;    
        }
	}
}