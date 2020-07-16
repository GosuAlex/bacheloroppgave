using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<User> userManager)
        {
            // if(!userManager.Users.Any())
            // {
            //     var users = new List<User>
            //     {
            //         new User
            //         {
            //             UserName = "user",
            //             Email = "user@test.com",
            //             FirstName = "user",
            //             LastName = "man",
            //             Role = 1
            //         },
            //         new User
            //         {
            //             UserName = "glenn",
            //             Email = "glenn@test.com",
            //             FirstName = "glenn",
            //             LastName = "pearson",
            //             Role = 1
            //         },
            //         new User
            //         {
            //             UserName = "emre",
            //             Email = "emre@test.com",
            //             FirstName = "emre",
            //             LastName = "olgun",
            //             Role = 2
            //         }
            //     };
            //     foreach (var user in users)
            //     {
            //         await userManager.CreateAsync(user, "Admin1!");
            //     }
            // }

            // if (!context.Students.Any())
            // {
            //     var students = new List<Student>
            //     {
            //         new Student
            //         {
            //             Email = "test@test.no",
            //             FirstName = "Haakon",
            //         },
            //         new Student
            //         {
            //             Email = "test@test.com",
            //             FirstName = "Roy",
            //         },
            //         new Student
            //         {
            //             Email ="test@test.org",
            //             FirstName = "Oystein",
            //         }
            //     };

            //     context.Students.AddRange(students);
            //     context.SaveChanges();
            // }
            // if (!context.Companies.Any())
            //  {
            //      var companies = new List<Company>
            //      {
            //          new Company
            //          {
            //              Email = "kongsberg@test.no",
            //              CompanyName = "Kongsberg Gruppen",
            //          },
            //          new Company
            //          {
            //              Email = "usn@test.no",
            //              CompanyName = "USN",
            //          }
            //      };

            //      context.Companies.AddRange(companies);
            //      context.SaveChanges();
            //  }
            //  if (!context.Teams.Any())
            //  {
            //      var teams = new List<Team>
            //      {
            //          new Team
            //          {
            //              Name = "Superteam 3",
            //              Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet mauris nisi. Mauris a mi ac risus congue consequat. In condimentum dui ut vehicula rhoncus. In a elit velit. Curabitur lobortis a risus ut scelerisque. Proin non condimentum urna. Aenean mattis risus nibh, vitae ornare orci pulvinar ut."
            //          },
            //          new Team
            //          {
            //              Name = "Daedalus",
            //              Description = "Aenean suscipit eros ante, vel aliquet augue ornare ac. Sed imperdiet ante ex, id ornare sem aliquet id. Curabitur ultricies nunc at ornare iaculis. Mauris fringilla nisi vitae risus iaculis, a auctor massa malesuada. Fusce porta varius erat, tristique euismod elit vulputate eget. Suspendisse mattis eros id tellus eleifend ullamcorper."
            //          }
            //      };

            //      context.Teams.AddRange(teams);
            //      context.SaveChanges();
            //  }
            //  if (!context.Messages.Any())
            //  {
            //      var messages = new List<Message>
            //      {
            //          new Message
            //          {
            //              Title = "Hi",
            //              Content = "Test message 1",
            //          },
            //          new Message
            //          {
            //              Title = "Welcome",
            //              Content = "Test message 2",
            //          }
            //      };

            //      context.Messages.AddRange(messages);
            //      context.SaveChanges();
            //  }
            //  if (!context.Assignments.Any())
            //  {
            //      var assignments = new List<Assignment>
            //      {
            //          new Assignment
            //          {
            //              Title = "Make this",
            //              Content = "Test",
            //              Deadline = DateTime.Now.AddMonths(4),
            //          },
            //          new Assignment
            //          {
            //              Title = "Do that",
            //              Content = "Vår første barnehage ble etablert i 1991 av initiativtaker Hanne Klamerholm. I dag har vi til sammen 7 barnehager, 4 barnehager i Bærum kommune og 3 barnehager i Oslo kommune. Barnehagene har hver sin styrer. Vi søker barnehagelærer til 2 av våre barnehager. BarnehagenVår Sofus og BarnehagenVår Løren. BarnehagenVår Sofus ligger i Bjerke bydel. BarnehagenVår Løren ligger på Løren, Grunerløkka bydel.",
            //              Deadline = DateTime.Now.AddMonths(2),
            //          }
            //      };

            //      context.Assignments.AddRange(assignments);
            //      context.SaveChanges();
            //  }
            //  if (!context.AssignmentRequests.Any())
            //  {
            //      var assignmentRequests = new List<AssignmentRequest>
            //      {
            //          new AssignmentRequest
            //          {
            //              Status = 1,
            //          },
            //          new AssignmentRequest
            //          {
            //              Status = 0,
            //          }
            //      };

            //      context.AssignmentRequests.AddRange(assignmentRequests);
            //      context.SaveChanges();
            //  }
        }
    }
}