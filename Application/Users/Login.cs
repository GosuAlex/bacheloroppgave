using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using MySql.Data.MySqlClient;
using Persistence;
using Application.Security;

namespace Application.Users
{
  public class Login
  {
    public class Query : IRequest<User>
    {
      public string Email { get; set; }
      public string Password { get; set; }
    }

    public class QueryValidator : AbstractValidator<Query>
    {
      public QueryValidator()
      {
        RuleFor(x => x.Email).NotEmpty();
        RuleFor(x => x.Password).NotEmpty();
      }
    }

    public class Handler : IRequestHandler<Query, User>
    {
      private readonly UserManager<User> _userManager;
      private readonly SignInManager<User> _signInManager;
      private readonly IJwtGenerator _jwtGenerator;


      // Needed to NuGet install AspNetCore Identity even though UserManager worked.
      public Handler(UserManager<User> userManager, SignInManager<User> signInManager, IJwtGenerator jwtGenerator)
      {
        _signInManager = signInManager;
        _userManager = userManager;
        _jwtGenerator = jwtGenerator;

      }

      public async Task<User> Handle(Query request, CancellationToken cancellationToken)
      {
        User user = new User();
        bool result = false;

        MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
        using (connection)
        {
          string sqlQuery = $"SELECT * FROM appuser WHERE email = '" + request.Email + "'";
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

              user.Password = reader["Password"].ToString();
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

        if (user.Email == null)
        {
          throw new RestException(HttpStatusCode.Unauthorized);
        }
        result = DaedalusPasswordHasher.VerifyHashedPassword(user.Password, request.Password);

        // uncomment for å vise hash til passordet ditt som du kan bytte i databasen 
        // Console.WriteLine(request.Password + " bytt til hash som passord på brukeren din i databasen:   " + DaedalusPasswordHasher.HashPassword(request.Password));
        
        
        // sett tredje parameter til true for lockout on failure login senere !##!
        //var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        //if (result.Succeeded)

        if (result)
        {
          return new User
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

        throw new RestException(HttpStatusCode.Unauthorized);
      }
    }
  }
}