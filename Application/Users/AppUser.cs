using System;
namespace Application.Users
{
    public class AppUser
    {
        public string Id { get; set; }
        public string Token { get; set; }
        public string Email { get; set; }
        // public string UserName { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Role { get; set; }
        public string Image { get; set; }
    }
}
