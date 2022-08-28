using System.ComponentModel.DataAnnotations;

namespace quality_control_platform_webapi.Models
{
    public class NotificationsDto
    {
        [Key]
        public int? NotificationId { get; set; }
        public int Sender { get; set; }
        public int Receiver { get; set; }
        public int ReportId { get; set; }
        public int Type { get; set; }   // 0 - report created
                                        // 1 - report accepted
                                        // 2 - report declined
                                        // 3 - report 
    }
}
