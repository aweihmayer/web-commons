namespace WebCommons.Dto
{
    /// <summary>
    /// <see cref="WebCommons.Db.TimestampableEntity"/>
    /// </summary>
    public interface TimestampableDto
    {
        DateTime? CreatedDate { get; set; }
        DateTime? UpdatedDate { get; set; }
    }
}
