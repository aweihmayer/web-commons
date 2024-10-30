namespace WebCommons.Dto
{
    /// <summary>
    /// <see cref="WebCommons.Db.ISoftDeleteEntity"/>
    /// </summary>
    public interface ISoftDeleteDto
    {
        DateTime? DeletedDate { get; set; }
    }
}
