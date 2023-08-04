using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using WebCommons.Db;

namespace WebCommons.Dto
{
    /// <summary>
    /// Defines the standard way to expose the system values and search configuration.
    /// </summary>
    public class SystemDto
    {
        [JsonProperty("createdDate", NullValueHandling = NullValueHandling.Ignore)]
        [JsonConverter(typeof(UnixDateTimeConverter))]
        public DateTime? CreatedDate { get; set; }

        [JsonProperty("updatedDate", NullValueHandling = NullValueHandling.Ignore)]
        [JsonConverter(typeof(UnixDateTimeConverter))]
        public DateTime? UpdatedDate { get; set; }

        [JsonProperty("searchable", NullValueHandling = NullValueHandling.Ignore)]
        public bool? Searchable { get; set; }

        public SystemDto(DateTime? created = null, DateTime? updated = null, bool? searchable = null)
        {
            this.CreatedDate = created;
            this.UpdatedDate = updated;
            this.Searchable = searchable;
        }

        public SystemDto(object obj)
        {
            this.SetTimestamps(obj);
        }

        public void SetTimestamps(object obj)
        {
            if (obj is TimestampableEntity timestampable) {
                this.CreatedDate = timestampable.CreatedDate;
                this.UpdatedDate = timestampable.UpdatedDate;
            }

            if (obj is SearchableEntity searchable)
            {
                this.Searchable = searchable.IsSearchable();
            }
        }
    }
}