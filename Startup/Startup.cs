using JavaScriptEngineSwitcher.Core;
using JavaScriptEngineSwitcher.V8;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using WebCommons.Bundling;

namespace WebCommons.Core
{
    /// <summary>
    /// Initializes the project with the necessary configuration.
    /// </summary>
    public static class StartupExtensions
    {
        public static void UseReact(this IServiceCollection services)
        {
            JsEngineSwitcher.Current.DefaultEngineName = V8JsEngine.EngineName;
            JsEngineSwitcher.Current.EngineFactories.AddV8();
        }

        public static void UseJsonEnumToIntConverter(this IServiceCollection services)
        {
            JsonConvert.DefaultSettings = (() => {
                var settings = new JsonSerializerSettings();
                settings.Converters.Add(new StringEnumConverter { AllowIntegerValues = true });
                return settings;
            });
        }

        public static void SetRazorPagesRootDirectory(this IServiceCollection services, string path)
        {
            services.AddRazorPages(options => {
                options.RootDirectory = path;
            });
        }

        public static void UseSinglePageApplication(this IServiceCollection services, string viewStartPath = null)
        {
            services.Configure<RazorViewEngineOptions>(options =>
            {
                options.ViewLocationFormats.Clear();
                options.ViewLocationFormats.Add("/Views/{0}.cshtml");
                options.ViewLocationFormats.Add("/Pages/{0}.cshtml");
                options.ViewLocationFormats.Add("/Views/{1}/{0}.cshtml");
                options.ViewLocationFormats.Add("/Pages/{1}/{0}.cshtml");
                options.ViewLocationFormats.Add("/Views/Shared/{0}.cshtml");
                options.ViewLocationFormats.Add("/Pages/Shared/{0}.cshtml");
            });


            
            services.Configure<RazorViewEngineOptions>(options => {
                options.ViewLocationExpanders.Add(new CommonViewLocationExpander(viewStartPath));
            });
        }

        public class CommonViewLocationExpander : IViewLocationExpander
        {
            public string[] ViewPaths { get; set; }

            public CommonViewLocationExpander(string viewPath) : this(new string[] { viewPath }) { }

            public CommonViewLocationExpander(string[] viewPaths)
            {
                this.ViewPaths = viewPaths;
            }

            public void PopulateValues(ViewLocationExpanderContext context) { }

            public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context, IEnumerable<string> viewLocations)
            {
                var locations = new[]
                {
                    "~/Views/{1}/{0}.cshtml",
                    "~/Views/Shared/{0}.cshtml",
                    "~/Ui/Layout/_ViewStart.cshtml"
                };

                return locations.Union(this.ViewPaths);
            }
        }
    }
}