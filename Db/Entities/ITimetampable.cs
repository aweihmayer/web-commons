namespace WebCommons.Db
{
    /// <summary>
    /// Defines entities that have a timestamp of their creation and last updated date.
    /// </summary>
    public interface ITimestampableEntity
    {
        DateTime CreatedDate { get; set; }
        DateTime UpdatedDate { get; set; }
    }
}
