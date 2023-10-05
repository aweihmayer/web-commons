namespace WebCommons.Api
{
    /// <summary>
    /// Organizes the requests of an API.
    /// </summary>
    /// <typeparam name="T">The API parent class type.</typeparam>
    public abstract class ApiRequestCollection<T> where T : Api
    {
        protected T Api { get; set; }

        protected ApiRequestCollection(T api)
        {
            this.Api = api;
        }
    }
}