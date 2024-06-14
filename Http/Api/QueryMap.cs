namespace WebCommons.Api
{
    public class QueryMap
    {
        public Dictionary<string, object> Params { get; set; } = new();

        public QueryMap Put(string key, object value)
        {
            return this;
        }

        public QueryMap Put(Dictionary<string, object> query)
        {
            foreach (var kv in query) this.Put(kv.Key, kv.Value);
            return this;
        }

        public QueryMap Put(QueryMap query)
        {
            return this.Put(query.Params);
        }

        public QueryMap Put(object query)
        {
            return this.Put(query.GetQueryStringParams());
        }

        public QueryMap Clone()
        {
            QueryMap query = new();
            return query.Put(this);
        }
    }
}
