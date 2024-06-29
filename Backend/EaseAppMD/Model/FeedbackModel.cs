using System.ComponentModel.DataAnnotations;

namespace EaseAppMD.Model
{
    public class FeedbackModel
    {
        [Key]
        public int FeedbackId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
    }
}
