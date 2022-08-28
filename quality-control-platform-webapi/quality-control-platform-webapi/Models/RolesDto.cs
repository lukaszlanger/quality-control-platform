using System.ComponentModel.DataAnnotations;

namespace quality_control_platform_webapi.Models
{
    public class RolesDto
    {
        [Key]
        public int? RoleId { get; set; }
        public string Name { get; set; }
        public string RoleToken { get; set; }
    }
}
