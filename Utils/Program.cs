using JavaScriptEngineSwitcher.Core;
using JavaScriptEngineSwitcher.Extensions.MsDependencyInjection;
using JavaScriptEngineSwitcher.V8;
using Microsoft.AspNetCore.Mvc.Razor;
using Newtonsoft.Json;
using React.AspNet;
using WebCommons.Bundling;
using WebCommons.IO;
using WebCommons.Utils;

namespace WebCommons.Utils
{
    public static class ProgramExtensions
    {
        public static void Test()
        {
                        var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllersWithViews();
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddReact();
            JsEngineSwitcher.Current.DefaultEngineName = V8JsEngine.EngineName;
            JsEngineSwitcher.Current.EngineFactories.AddV8();
            builder.Services.AddJsEngineSwitcher(options => options.DefaultEngineName = V8JsEngine.EngineName).AddV8();            

            JsonConvert.DefaultSettings = (() => {
                var settings = new JsonSerializerSettings();
                settings.Converters.Add(new JsonEnumToIntConverter());
                settings.Converters.Add(new JsonTimeSpanToIntConverter());
                return settings;
            });

            builder.Services.AddRazorPages(options => { options.RootDirectory = VIEW_ROOT_PATH; });
            builder.Services.Configure<RazorViewEngineOptions>(options => { options.ViewLocationFormats.Add("~/Ui/Layout/empty.cshtml"); });

            var app = builder.Build();

            app.UseReact(config => { config.SetLoadReact(true); });

            CustomBundleManager.IsCachingEnabled = !app.Environment.IsDevelopment();
            SystemFile.Root = app.Environment.ContentRootPath;

            if (!app.Environment.IsDevelopment()) {
                app.UseHttpsRedirection();
                app.UseHsts();
            }

            app.UseRouting();
            app.UseStatusCodePagesWithReExecute("/error/{0}");
            app.UseEndpoints(endpoints => {
                endpoints.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");
            });

            app.MapRazorPages();
            app.Run();
        }
    }
}
