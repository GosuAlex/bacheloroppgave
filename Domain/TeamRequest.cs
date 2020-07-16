using System;

namespace Domain
{
    public class TeamRequest
    {
        public Guid Id { get; set; } 
        public Guid TeamId { get; set; }
        public Guid UserId { get; set; }
        public int Status { get; set; }


    }
}