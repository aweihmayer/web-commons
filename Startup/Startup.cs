using JavaScriptEngineSwitcher.Core;
using JavaScriptEngineSwitcher.V8;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Razor.RuntimeCompilation;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using WebCommons.Bundling;

namespace WebCommons.Core
{
    /// <summary>
    /// Initializes the project with the necessary configuration.
    /// </summary>
    public static class CommonStartup
    {
        /// <summary>
        /// Initializes the project with the necessary configuration.
        /// </summary>
        /// <param name="environment">The environment of the app. If the environment is dev, bundle caching will be disabled.</param>
        public static void Init(WebApplicationBuilder builder, IWebHostEnvironment environment)
        {
            // Disable bundle caching if the environment is not production
            CustomBundleManager.IsCachingEnabled = !environment.IsDevelopment();

            // React
            JsEngineSwitcher.Current.DefaultEngineName = V8JsEngine.EngineName;
            JsEngineSwitcher.Current.EngineFactories.AddV8();

            // View
            builder.Services.AddRazorPages();
            builder.Services.Configure<MvcRazorRuntimeCompilationOptions>(options => {
                options.FileProviders.Clear();
                options.FileProviders.Add(new PhysicalFileProvider("/path/to/custom/views"));
            });
            /*
            builder.Services.AddMvc().AddViewOptions(options => {
                options.ViewEngines.Clear();
                options.ViewLocationFormats.Clear();
                options.ViewLocationFormats.Add("/Views/{1}/{0}" + RazorViewEngine.ViewExtension);
                options.ViewLocationFormats.Add("/Views/Shared/{0}" + RazorViewEngine.ViewExtension);
                options.ViewEngines.Add(typeof(CommonViewEngine));
            });*/

            // Json serialization
            JsonConvert.DefaultSettings = (() => {
                var settings = new JsonSerializerSettings();
                settings.Converters.Add(new StringEnumConverter { AllowIntegerValues = true });
                return settings; });

            // NEW            

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            if (environment.IsProduction()) { app.UseHttpsRedirection(); }

            app.UseStaticFiles();

            app.UseRouting();

            app.Run();
        }
    }
}