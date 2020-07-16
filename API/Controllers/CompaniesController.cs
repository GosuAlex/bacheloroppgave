using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using MySql.Data.MySqlClient;
using Application.Errors;
using System.Net;
using MediatR;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [AllowAnonymous] // Bare for å fjerne autentisering. remove me later !!!!
  public class CompaniesController : BaseController
  {

    [HttpGet("{id}")]
    public ActionResult<Company> Current(string id)
    {
      Company company = new Company();
      MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");

      using (connection)
      {
        string sqlQuery = $"SELECT * FROM company WHERE UserId = '{id}'";
        MySqlCommand command = new MySqlCommand(sqlQuery, connection);

        try
        {
          connection.Open();
          command.Prepare();
          MySqlDataReader reader = command.ExecuteReader();

          while (reader.Read())
          {
            company.Id = reader["Id"].ToString();
            company.Name = reader["Name"].ToString();
            company.Description = reader["Description"].ToString();
            company.UserId = reader["UserId"].ToString();
          };
          reader.Close();

        }
        catch (Exception e)
        {
          Console.WriteLine(e.ToString());
          connection.Close();
        }
        connection.Close();
      }

      return company;
    }

    [HttpPost]
    public ActionResult<Unit> Create(Company company)
    {
      int? result = 0;
      string sqlQuery = $"INSERT INTO company (id,name,description,userid) VALUES (@Id,@Name,@Description,@UserId)";
  
      using (connection)
      {

        try
        {
          MySqlCommand command = new MySqlCommand(sqlQuery, connection);
          connection.Open();
          command.Prepare();

          command.Parameters.AddWithValue("@Id", company.Id);
          command.Parameters.AddWithValue("@Name", company.Name);
          command.Parameters.AddWithValue("@Description", company.Description);
          command.Parameters.AddWithValue("@UserId", company.UserId);

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
        return Ok();
      }

      throw new RestException(HttpStatusCode.NotFound);
      throw new Exception("Problem");
    }
  }
}