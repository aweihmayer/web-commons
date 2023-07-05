namespace WebCommons.Db
{
    /// <summary>
    /// Defines entities that can be searched by a user.
    /// </summary>
    interface SearchableEntity
    {
        bool IsSearchable();
    }
}
