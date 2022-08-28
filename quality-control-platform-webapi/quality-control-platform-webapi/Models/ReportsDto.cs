using System;
using System.ComponentModel.DataAnnotations;

namespace quality_control_platform_webapi.Models
{
    public class ReportsDto
    {
        [Key]
        public int? ReportId { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime? ArchivingDate { get; set; }
        public int DamageType { get; set; }
        public string Description { get; set; }
        public string PhotosPath { get; set; }
        public string Signature { get; set; }
        public int? Decision { get; set; }
        public int ReportAcceptance { get; set; }
        public bool IsArchived { get; set; }
        public int ItemId { get; set; }
        public int WorkerId { get; set; }
    }
}


