using System.ComponentModel.DataAnnotations;

namespace quality_control_platform_webapi.Models
{
    public class ItemsDto
    {
        [Key]
        public int? ItemId { get; set; }
        public string Name { get; set; }
        public string SerialNumber { get; set; }
        public string Manufacturer { get; set; }
    }
}
