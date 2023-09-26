using System.ComponentModel.DataAnnotations;

namespace WebCommons.Model
{
    /// <summary>
    /// Defines the values of a request.
    /// </summary>
    public static class ModelExtensions
    {
        /// <summary>
        /// Determines if the model is valid.
        /// </summary>
        public static bool IsValidModel(this object obj)
		{
            ValidationContext context = new(obj);
            List<ValidationResult> results = new();
            return Validator.TryValidateObject(obj, context, results, true);
		}
    }
}