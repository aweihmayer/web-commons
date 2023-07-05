using JavaScriptEngineSwitcher.Core;
using JavaScriptEngineSwitcher.V8;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Web.Mvc;
using System.Web.Routing;
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

            // Views
            ViewEngines.Engines.Clear();
            ViewEngines.Engines.Add(new CustomViewEngine());
            AreaRegistration.RegisterAllAreas();

            // Routing
            RouteTable.Routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            RouteTable.Routes.MapMvcAttributeRoutes();
            RouteTable.Routes.RouteExistingFiles = false;

            // Json serialization
            JsonConvert.DefaultSettings = (() => {
                var settings = new JsonSerializerSettings();
                settings.Converters.Add(new StringEnumConverter { AllowIntegerValues = true });
                return settings; });

            // NEW

            // Add services to the container.
            builder.Services.AddRazorPages();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            

            app.Run();
        }
    }
}