using System.Threading;
using System;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;
using MySql.Data.MySqlClient;

namespace Application.Users
{
  public class CurrentUser
  {
    public class Query : IRequest<AppUser> { }

    public class Handler : IRequestHandler<Query, AppUser>
    {
      private readonly UserManager<User> _userManager;
      private readonly IJwtGenerator _jwtGenerator;
      private readonly IUserAccessor _userAccessor;
      public Handler(UserManager<User> userManager, IJwtGenerator jwtGenerator, IUserAccessor userAccessor)
      {
        _userAccessor = userAccessor;
        _jwtGenerator = jwtGenerator;
        _userManager = userManager;
      }

      public async Task<AppUser> Handle(Query request, CancellationToken cancellationToken)
      {
        var email = _userAccessor.GetCurrentUsername();

        User user = new User();

        MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
        using (connection)
        {
          string sqlQuery = $"SELECT * FROM appuser WHERE email = '" + email + "'";
          MySqlCommand command = new MySqlCommand(sqlQuery, connection);

          try
          {
            connection.Open();
            command.Prepare();
            MySqlDataReader reader = command.ExecuteReader();

            while (reader.Read())
            {
              user.Email = reader["Email"].ToString();
              user.Id = reader["Id"].ToString();
              user.FirstName = reader["FirstName"].ToString();
              user.LastName = reader["LastName"].ToString();
              user.Role = Convert.ToInt32(reader["Role"]);
            }
            reader.Close();
          }
          catch (Exception e)
          {
            Console.WriteLine(e.ToString());
            connection.Close();
          }
          connection.Close();
        }

        return new AppUser
        {
          Token = _jwtGenerator.CreateToken(user),
          Id = user.Id,
          Email = user.Email,
          FirstName = user.FirstName,
          LastName = user.LastName,
          Role = user.Role,
          // Username = user.UserName,
          Image = null
        };
      }
    }
  }
}