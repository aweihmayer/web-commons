namespace WebCommons.Dto
{
    /// <summary>
    /// <see cref="TimestampableEntity"/>
    /// </summary>
    public interface TimestampableDto
    {
        DateTimeOffset? CreatedDate { get; set; }
        DateTimeOffset? UpdatedDate { get; set; }
    }
}
