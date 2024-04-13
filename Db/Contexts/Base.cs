using Microsoft.EntityFrameworkCore;

namespace WebCommons.Db
{
    /// <summary>
    /// Defines a custom DB context to handle entity class interfaces.
    /// </summary>
    public abstract class CommonDbContext : DbContext
    {
        protected CommonDbContext() { }

        protected CommonDbContext(DbContextOptions options) : base(options) { }

        public override int SaveChanges()
        {
            foreach (var changedEntity in ChangeTracker.Entries()) {
                ITimestampableEntity? timestampable;
                ISoftDeleteEntity? softDelete;

                switch (changedEntity.State) {
                    case EntityState.Added:
                        // Timestampable entity will have created and updated timestamps set to now
                        timestampable = changedEntity.Entity as ITimestampableEntity;
                        if (timestampable == null) break;
                        timestampable.CreatedDate = DateTime.UtcNow;
                        timestampable.UpdatedDate = DateTime.UtcNow;
                        break;

                    case EntityState.Modified:
                        // Timestampable entity will have its update timestamp set to now
                        timestampable = changedEntity.Entity as ITimestampableEntity;
                        if (timestampable == null) break;
                        timestampable.UpdatedDate = DateTime.UtcNow;
                        break;

                    case EntityState.Deleted:
                        // Soft delete entity won't be permanently deleted, but have a deleted date timestamp
                        softDelete = changedEntity.Entity as ISoftDeleteEntity;
                        if (softDelete == null) break;
                        softDelete.DeletedDate = DateTime.UtcNow;
                        changedEntity.State = EntityState.Modified;
                        break;

                    default: 
                        break;
                }
            }

            return base.SaveChanges();
        }
    }
}
 