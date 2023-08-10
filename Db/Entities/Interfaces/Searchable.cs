namespace WebCommons.Db
{
    /// <summary>
    /// Defines entities that can be searched by a user.
    /// </summary>
    public interface SearchableEntity
    {
        bool IsSearchable();
    }
}
