using System;

namespace Domain
{
    public class Assignment
    {
        public string Id { get; set; } 
        public string CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string CategoryName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime TimePosted { get; set; }
        public DateTime Deadline { get; set; }
        public int Status { get; set; }
        public User Creator { get; set; }

        public string CategoryId { get; set; }
    }
}