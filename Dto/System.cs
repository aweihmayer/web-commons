using Newtonsoft.Json;
using WebCommons.Db;

namespace WebCommons.Dto
{
    /// <summary>
    /// Defines the standard way to expose the system values and search configuration.
    /// </summary>
    public class SystemDto
    {
        [JsonProperty("createdDate", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? CreatedDate { get; set; }

        [JsonProperty("updatedDate", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime? UpdatedDate { get; set; }

        public SystemDto(DateTime? created = null, DateTime? updated = null)
        {
            this.CreatedDate = created;
            this.UpdatedDate = updated;
        }

        public SystemDto(object obj)
        {
            if (obj is TimestampableEntity timestampable) {
                this.CreatedDate = timestampable.CreatedDate;
                this.UpdatedDate = timestampable.UpdatedDate;
            }
        }

        public void SetTimestamps(TimestampableEntity obj)
        {
            this.CreatedDate = obj.CreatedDate;
            this.UpdatedDate = obj.UpdatedDate;
        }
    }
}