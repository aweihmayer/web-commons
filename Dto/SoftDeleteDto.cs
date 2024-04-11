namespace WebCommons.Dto
{
    /// <summary>
    /// <see cref="WebCommons.Db.SoftDeleteEntity"/>
    /// </summary>
    public interface SoftDeleteEntity
    {
        DateTime? DeletedDate { get; set; }
    }
}
