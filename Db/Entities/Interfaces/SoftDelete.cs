namespace WebCommons.Db
{
    /// <summary>
    /// Defines entities that are not deleted permanently. They have a timestamp of their deletion date instead.
    /// </summary>
    public interface SoftDeleteEntity
    {
        DateTimeOffset DeletedDate { get; set; }
    }
}
