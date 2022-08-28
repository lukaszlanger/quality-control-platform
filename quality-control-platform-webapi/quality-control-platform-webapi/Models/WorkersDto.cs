using System.ComponentModel.DataAnnotations;

namespace quality_control_platform_webapi.Models
{
    public class WorkersDto
    {
        [Key]
        public int? WorkerId { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; } // Used to login
        public string IdentityNumber { get; set; } // UID in FireBase
        public int RoleId { get; set; }
        public bool IsActive { get; set; }
    }
}
