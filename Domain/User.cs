using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;


namespace Domain
{
  public class User : IdentityUser
  // public class User
  {
    public override string Id { get; set; }
    public string Token { get; set; }
    public override string Email { get; set; }
    public override string UserName { get; set; }
    public string Password { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public int Role { get; set; }
    public string Image { get; set; }
  }
}
