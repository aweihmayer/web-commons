namespace WebCommons.Dto
{
    /// <summary>
    /// <see cref="TimestampableEntity"/>
    /// </summary>
    public interface TimestampableDto
    {
        DateTime? CreatedDate { get; set; }
        DateTime? UpdatedDate { get; set; }
    }
}
