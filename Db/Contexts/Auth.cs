using Microsoft.EntityFrameworkCore;
using WebCommons.Auth;
using WebCommons.Dto;

namespace WebCommons.Db
{
    /// <summary>
    /// Defines a custom DB context able to handle user authentication.
    /// </summary>
    public class CommonDbContextWithAuth<TUser> : CommonDbContext where TUser : CommonUser
    {
        public DbSet<TUser> Users { get; set; }

        public DbSet<UserToken<TUser>> Tokens { get; set; }

        public CommonDbContextWithAuth() { }

        public CommonDbContextWithAuth(DbContextOptions options) : base(options) { }
    }
}