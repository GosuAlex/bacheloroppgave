using System.Threading.Tasks;
using Application.Users;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Net;
using System;
using Application.Errors;

namespace API.Controllers
{
  public class UserController : BaseController
  {
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<User>> Login(Login.Query query)
    {
      return await Mediator.Send(query);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<AppUser>> Register(Register.Command command)
    {
      return await Mediator.Send(command);
    }

    [HttpGet]
    public async Task<ActionResult<AppUser>> CurrentUser()
    {
      return await Mediator.Send(new CurrentUser.Query());
    }

    [HttpGet("{id}")]
    public ActionResult<User> Profile(string id)
    {
      User user = new User();

      MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
      using (connection)
      {
        string sqlQuery = $"SELECT * FROM appuser WHERE id = '" + id + "'";
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
            user.Image= reader["ImagePath"].ToString();
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


      if (user.Email != null)
      {
        return user;
      }

      throw new RestException(HttpStatusCode.NotFound);
    }
  }
}