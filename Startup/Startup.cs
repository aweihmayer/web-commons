using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace WebCommons.Core
{
    /// <summary>
    /// Initializes the project with the necessary configuration.
    /// </summary>
    public static class StartupExtensions
    {
        public static void UseJsonEnumToIntConverter(this IServiceCollection services)
        {
            JsonConvert.DefaultSettings = (() => {
                var settings = new JsonSerializerSettings();
                settings.Converters.Add(new StringEnumConverter { AllowIntegerValues = true });
                return settings;
            });
        }
    }
}