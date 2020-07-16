using System;

namespace Domain
{
    public class Message
    {
        public string Id { get; set; } 
        public string SenderUserId { get; set; }
        public string ReceiverUserId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string Status { get; set; }
        public string Date { get; set;}
        public string FirstName { get; set;}
        public string LastName { get; set;}
        public string Email { get; set;}
    }
}