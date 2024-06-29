using System.ComponentModel.DataAnnotations;

namespace EaseAppMD.Model
{
    public class Doctors
    {
            [Key]
            public int Id { get; set; }
            public string Name { get; set; }
            public string Speciality { get; set; }
            public string Image_url { get; set; }
            public decimal Fee { get; set; }
            public string Biography { get; set; }

    }
}
