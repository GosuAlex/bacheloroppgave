using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;
using MySql.Data.MySqlClient;
using Application.Security;

namespace Application.Users
{
  public class Register
  {
    public class Command : IRequest<AppUser>
    {
      public string Username { get; set; }
      public string Email { get; set; }
      public string FirstName { get; set; }
      public string LastName { get; set; }
      public int Role { get; set; }
      public string Password { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
      public CommandValidator()
      {
        RuleFor(x => x.Username).NotEmpty();
        RuleFor(x => x.FirstName).NotEmpty();
        RuleFor(x => x.LastName).NotEmpty();
        RuleFor(x => x.Role).NotEmpty();
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).Password();
      }
    }

    public class Handler : IRequestHandler<Command, AppUser>
    {
      private readonly DataContext _context;
      private readonly UserManager<User> _userManager;
      private readonly IJwtGenerator _jwtGenerator;
      public Handler(DataContext context, UserManager<User> userManager, IJwtGenerator jwtGenerator)
      {
        _jwtGenerator = jwtGenerator;
        _userManager = userManager;
        _context = context;
      }

      public async Task<AppUser> Handle(Command request, CancellationToken cancellationToken)
      {
        var user = new User
        {
          UserName = request.Username,
          Email = request.Email,
          Password = DaedalusPasswordHasher.HashPassword(request.Password),
          FirstName = request.FirstName,
          LastName = request.LastName,
          Role = request.Role
        };
        int? result = null;

        MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
        
        ////// Check Email

        bool foundExistingEmail = false;

        string sqlCheckEmailQuery = $"SELECT * FROM appuser WHERE email = '" + request.Email + "'";
        MySqlCommand commandCheckEmail = new MySqlCommand(sqlCheckEmailQuery, connection);

        try
          {
            connection.Open();
            commandCheckEmail.Prepare();
            MySqlDataReader reader = commandCheckEmail.ExecuteReader();

            while (reader.Read())
            {
              foundExistingEmail = request.Email == reader["Email"].ToString();
            }
            reader.Close();
          }
          catch (Exception e)
          {
            Console.WriteLine(e.ToString());
            connection.Close();
          }
        connection.Close();

        //////

        if (foundExistingEmail)
          throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists" });
        // if (await _context.Users.Where(x => x.UserName == request.Username).AnyAsync())
        //   throw new RestException(HttpStatusCode.BadRequest, new { Username = "Username already exists" });

        using (connection)
        {
          string sqlQuery = $"INSERT INTO appuser (id,email,firstname,lastname,password,role) VALUES (@id,@Email,@FirstName,@LastName,@Password,@Role)";

          try
          {
            MySqlCommand command = new MySqlCommand(sqlQuery, connection);
            connection.Open();
            command.Prepare();

            command.Parameters.AddWithValue("@Id", user.Id);
            command.Parameters.AddWithValue("@Email", user.Email);
            command.Parameters.AddWithValue("@FirstName", user.FirstName);
            command.Parameters.AddWithValue("@LastName", user.LastName);
            command.Parameters.AddWithValue("@Password", user.Password);
            command.Parameters.AddWithValue("@Role", user.Role);
            result = command.ExecuteNonQuery();
          }
          catch (Exception e)
          {
            Console.WriteLine(e.ToString());
            connection.Close();
          }
          connection.Close();
        }

        if (result > 0)
        {
          return new AppUser
          {
            Token = _jwtGenerator.CreateToken(user),
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            Image = null
          };
        }

        throw new Exception("Problem creating user");
      }
    }
  }
}