namespace WebCommons.Api
{
    /// <summary>
    /// Organizes the requests of an API.
    /// </summary>
    /// <typeparam name="T">The API parent class type.</typeparam>
    public abstract class ApiRequestCollection<TApi> where TApi : Api
    {
        protected TApi Api { get; set; }

        protected ApiRequestCollection(TApi api)
        {
            this.Api = api;
        }
    }
}