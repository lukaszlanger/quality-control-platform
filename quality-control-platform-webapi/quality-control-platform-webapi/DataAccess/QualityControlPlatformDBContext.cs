using Microsoft.EntityFrameworkCore;
using quality_control_platform_webapi.Models;

namespace quality_control_platform_webapi.DataAccess
{
    public class QualityControlPlatformDBContext : DbContext
    {
        public QualityControlPlatformDBContext(DbContextOptions options) : base(options) { }
        public DbSet<ItemsDto> Items { get; set; }
        public DbSet<ReportsDto> Reports { get; set; }
        public DbSet<RolesDto> Roles { get; set; }
        public DbSet<WorkersDto> Workers { get; set; }
        public DbSet<NotificationsDto> Notifications { get; set; }
    }
}
