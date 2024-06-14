using System.Reflection;
using WebCommons;

namespace Microsoft.AspNetCore.Mvc
{
    public static class ControllerExtensions
    {
        /// <summary>
        /// Determines if the model is valid.
        /// </summary>
        /// <returns>True if the model is valid, otherwise false.</returns>
        /// <exception cref="BadRequestException">Thrown as a bad request (400) if the model is not valid.</exception>
        public static bool ModelMustBeValid(this Controller controller)
        {
            if (controller.ModelState.IsValid) return true;
            else throw new BadRequestException();
        }

        /// <summary>
        /// Determines if the controller has the API attribute
        /// </summary>
        /// <returns>True if the controller has the attribute, otherwise false.</returns>
        public static bool IsApiController(this Controller controller)
        {
            return controller.GetType().HasAttribute<ApiControllerAttribute>();
        }
    }
}