using System;
using System.Net;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Assignments;
using Domain;
using MediatR;
using Application.Errors;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

namespace API.Controllers
{
  [Route("api/[controller]/[action]")]
  public class AssignmentController : BaseController
  {
    [HttpGet]
    public List<Assignment> List()
    {
      List<Assignment> list = new List<Assignment>();

      using (connection)
      {
        string sqlQuery = @"SELECT a.Id, cat.Name AS CategoryName, a.Title, a.Description, a.TimePosted, a.Deadline, a.Status, c.Id AS CreatorId, c.Email AS CreatorEmail, c.FirstName AS CreatorFirstName, c.LastName AS CreatorLastName, c.ImagePath AS CreatorImagePath, company.Name AS CompanyName, company.Id AS CompanyId
          FROM assignment AS a
          LEFT JOIN company AS company
          ON a.CompanyId = company.Id
          LEFT JOIN appuser AS c
          ON c.Id = company.UserId
          LEFT JOIN category AS cat
          ON cat.Id = a.CategoryId
          WHERE a.Status = 2";
        MySqlCommand command = new MySqlCommand(sqlQuery, connection);

        try
        {
          connection.Open();
          command.Prepare();
          MySqlDataReader reader = command.ExecuteReader();

          while (reader.Read())
          {
            User creator = new User()
            {
              Id = reader["CreatorId"].ToString(),
              Email = reader["CreatorEmail"].ToString(),
              FirstName = reader["CreatorFirstName"].ToString(),
              LastName = reader["CreatorLastName"].ToString(),
              Image = reader["CreatorImagePath"].ToString(),
            };
            list.Add(

              new Assignment()
              {
                Id = reader["Id"].ToString(),
                CompanyId = reader["CompanyId"].ToString(),
                CompanyName = reader["CompanyName"].ToString(),
                CategoryName = reader["CategoryName"].ToString(),
                Title = reader["Title"].ToString(),
                Description = reader["Description"].ToString(),
                TimePosted = reader.GetDateTime(reader.GetOrdinal("TimePosted")),
                Deadline = reader.GetDateTime(reader.GetOrdinal("Deadline")),
                Status = Convert.ToInt32(reader["Status"]),

                Creator = creator
              }
            );
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

      return list;
    }

    [HttpGet("{categoryId}")]
    public List<Assignment> ListCategory(string categoryId)
    {
      List<Assignment> list = new List<Assignment>();

      using (connection)
      {
        string sqlQuery = string.Format(@"SELECT a.Id, cat.Name AS CategoryName, a.Title, a.Description, a.TimePosted, a.Deadline, a.Status, c.Id AS CreatorId, c.Email AS CreatorEmail, c.FirstName AS CreatorFirstName, c.LastName AS CreatorLastName, c.ImagePath AS CreatorImagePath, company.Name AS CompanyName, company.Id AS CompanyId
          FROM assignment AS a
          LEFT JOIN company AS company
          ON a.CompanyId = company.Id
          LEFT JOIN appuser AS c
          ON c.Id = company.UserId
          LEFT JOIN category AS cat
          ON cat.Id = a.CategoryId
          WHERE a.Status = 2 AND cat.Id = ""{0}"" ", categoryId);
        MySqlCommand command = new MySqlCommand(sqlQuery, connection);

        try
        {
          connection.Open();
          command.Prepare();
          MySqlDataReader reader = command.ExecuteReader();

          while (reader.Read())
          {
            User creator = new User()
            {
              Id = reader["CreatorId"].ToString(),
              Email = reader["CreatorEmail"].ToString(),
              FirstName = reader["CreatorFirstName"].ToString(),
              LastName = reader["CreatorLastName"].ToString(),
              Image = reader["CreatorImagePath"].ToString(),
            };
            list.Add(

              new Assignment()
              {
                Id = reader["Id"].ToString(),
                CompanyId = reader["CompanyId"].ToString(),
                CompanyName = reader["CompanyName"].ToString(),
                CategoryName = reader["CategoryName"].ToString(),
                Title = reader["Title"].ToString(),
                Description = reader["Description"].ToString(),
                TimePosted = reader.GetDateTime(reader.GetOrdinal("TimePosted")),
                Deadline = reader.GetDateTime(reader.GetOrdinal("Deadline")),
                Status = Convert.ToInt32(reader["Status"]),

                Creator = creator
              }
            );
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

      return list;
    }

    [HttpGet("{id}")]
    public ActionResult<Assignment> Details(string id)
    {
      Assignment assignment = new Assignment();

      using (connection)
      {
        string sqlQuery = string.Format(@"SELECT a.Id, cat.Name AS CategoryName, a.Title, a.Description, a.TimePosted, a.Deadline, a.Status, c.Id AS CreatorId, c.Email AS CreatorEmail, c.FirstName AS CreatorFirstName, c.LastName AS CreatorLastName, c.ImagePath AS CreatorImagePath, company.Name AS CompanyName, company.Id AS CompanyId
          FROM assignment AS a
          LEFT JOIN company AS company
          ON a.CompanyId = company.Id
          LEFT JOIN appuser AS c
          ON c.Id = company.UserId
          LEFT JOIN category AS cat
          ON cat.Id = a.CategoryId
          WHERE a.Id = ""{0}"" ", id);
        MySqlCommand command = new MySqlCommand(sqlQuery, connection);

        try
        {
          connection.Open();
          command.Prepare();
          MySqlDataReader reader = command.ExecuteReader();

          while (reader.Read())
          {
            User creator = new User()
            {
              Id = reader["CreatorId"].ToString(),
              Email = reader["CreatorEmail"].ToString(),
              FirstName = reader["CreatorFirstName"].ToString(),
              LastName = reader["CreatorLastName"].ToString(),
              Image = reader["CreatorImagePath"].ToString(),
            };
            assignment.Creator = creator;

            assignment.Id = reader["Id"].ToString();
            assignment.CompanyId = reader["CompanyId"].ToString();
            assignment.CompanyName = reader["CompanyName"].ToString();
            assignment.CategoryName = reader["CategoryName"].ToString();
            assignment.Title = reader["Title"].ToString();
            assignment.Description = reader["Description"].ToString();
            assignment.TimePosted = reader.GetDateTime(reader.GetOrdinal("TimePosted"));
            assignment.Deadline = reader.GetDateTime(reader.GetOrdinal("Deadline"));
            assignment.Status = Convert.ToInt32(reader["Status"]);
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

      if (assignment.Title != null)
      {
        return assignment;
      }

      throw new RestException(HttpStatusCode.NotFound);
    }

    [HttpPost]
    public ActionResult<Unit> Create(Assignment assignment)
    {
      int? result = 0;
      string sqlQuery = $"INSERT INTO assignment (id,companyid,categoryid,title,description,timeposted,deadline,status) VALUES (@Id,@CompanyId,@CategoryId,@Title,@Description,@Timeposted,@Deadline,@Status)";

      using (connection)
      {

        try
        {
          MySqlCommand command = new MySqlCommand(sqlQuery, connection);
          connection.Open();
          command.Prepare();

          command.Parameters.AddWithValue("@Id", assignment.Id);
          command.Parameters.AddWithValue("@CompanyId", assignment.CompanyId);
          command.Parameters.AddWithValue("@CategoryId", assignment.CategoryId);
          command.Parameters.AddWithValue("@Title", assignment.Title);
          command.Parameters.AddWithValue("@Description", assignment.Description);
          command.Parameters.AddWithValue("@TimePosted", assignment.TimePosted);
          command.Parameters.AddWithValue("@Deadline", assignment.Deadline);
          command.Parameters.AddWithValue("@Status", assignment.Status);
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

    [HttpPut("{id}")]
    public ActionResult<Unit> Update(Assignment assignment)
    {
      string sqlFormattedDate = assignment.Deadline.ToString("yyyy/MM/dd HH:mm:ss");
      int? result = 0;
      string sqlQuery = $"UPDATE assignment SET Title='{assignment.Title}', Description='{assignment.Description}', Deadline='{sqlFormattedDate}', Status={assignment.Status} WHERE Id='{assignment.Id}'";

      using (connection)
      {
        MySqlTransaction transaction = null;

        try
        {
          MySqlCommand command = new MySqlCommand(sqlQuery, connection);
          connection.Open();
          transaction = connection.BeginTransaction();
          command.Transaction = transaction;

          result = command.ExecuteNonQuery();
          transaction.Commit();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.ToString());
          transaction.Rollback();
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

    [HttpDelete("{id}")]
    public ActionResult<Unit> Delete(string id)
    {
      int? result = 0;
      using (connection)
      {
        string sqlQuery = $"DELETE FROM assignment WHERE id ='{id}';";

        try
        {
          MySqlCommand command = new MySqlCommand(sqlQuery, connection);
          connection.Open();
          result = command.ExecuteNonQuery();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.ToString());
          connection.Close();
        }
        connection.Close();
      }

      if (result > 0) return Ok();
      throw new RestException(HttpStatusCode.NotFound);
      throw new Exception("Problem");
    }

    [HttpPost]
    public ActionResult<Unit> Join(AssignmentMember assignmentMember)
    {
      int? result = 0;
      string sqlQuery = $"INSERT INTO assignmentMember (Id,TeamId,AssignmentId,Status) VALUES (@Id,@TeamId,@AssignmentId,@Status)";

      using (connection)
      {
        try
        {
          MySqlCommand command = new MySqlCommand(sqlQuery, connection);
          connection.Open();
          command.Prepare();

          command.Parameters.AddWithValue("@Id", assignmentMember.Id);
          command.Parameters.AddWithValue("@TeamId", assignmentMember.TeamId);
          command.Parameters.AddWithValue("@AssignmentId", assignmentMember.AssignmentId);
          command.Parameters.AddWithValue("@Status", assignmentMember.Status);
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

    [HttpPut]
    public ActionResult<Unit> AcceptTeamOnAssignment(AssignmentRequest request)
    {
      int? result = 0;
      string sqlQuery = $"UPDATE assignmentMember SET Status='1' WHERE Id='{request.Id}' AND teamId='{request.TeamId}' ";

      using (connection)
      {
        MySqlTransaction transaction = null;

        try
        {
          MySqlCommand command = new MySqlCommand(sqlQuery, connection);
          connection.Open();
          transaction = connection.BeginTransaction();
          command.Transaction = transaction;

          result = command.ExecuteNonQuery();
          transaction.Commit();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.ToString());
          transaction.Rollback();
          connection.Close();
        }
        connection.Close();
      }

      if (result > 0)
      {
        return Ok();
      }
      return Ok();
      // throw new RestException(HttpStatusCode.NotFound);
      // throw new Exception("Problem");
    }

    [HttpPut]
    public ActionResult<Unit> DenyTeamOnAssignment(AssignmentRequest request)
    {
      int? result = 0;
      string sqlQuery = $"DELETE FROM assignmentmember WHERE Id='{request.Id}' AND TeamId='{request.TeamId}' ;";

      using (connection)
      {
        MySqlTransaction transaction = null;

        try
        {
          MySqlCommand command = new MySqlCommand(sqlQuery, connection);
          connection.Open();
          transaction = connection.BeginTransaction();
          command.Transaction = transaction;

          result = command.ExecuteNonQuery();
          transaction.Commit();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.ToString());
          transaction.Rollback();
          connection.Close();
        }
        connection.Close();
      }

      if (result > 0)
      {
        return Ok();
      }
      return Ok();
      // throw new RestException(HttpStatusCode.NotFound);
      // throw new Exception("Problem");
    }

    [HttpDelete("{combinedString}")]
    public ActionResult<Unit> Leave(string combinedString)
    {
      string[] explodedString = combinedString.Split('|');
      string teamId = explodedString[0];
      string assignmentId = explodedString[1];

      int? result = 0;
      using (connection)
      {
        string sqlQuery = $"DELETE FROM assignmentMember WHERE TeamId ='{teamId}' AND AssignmentId = '{assignmentId}';";

        try
        {
          MySqlCommand command = new MySqlCommand(sqlQuery, connection);
          connection.Open();
          result = command.ExecuteNonQuery();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.ToString());
          connection.Close();
        }
        connection.Close();
      }

      if (result > 0) return Ok();
      throw new RestException(HttpStatusCode.NotFound);
      throw new Exception("Problem");
    }

    [HttpGet("{id}")]
    public ActionResult<List<string>> Teams(string id)
    {
      List<string> teams = new List<string>();
      MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");

      using (connection)
      {
        string sqlQuery = $"SELECT TeamId FROM assignmentmember WHERE AssignmentId = '{id}'";
        MySqlCommand command = new MySqlCommand(sqlQuery, connection);

        try
        {
          connection.Open();
          command.Prepare();
          MySqlDataReader reader = command.ExecuteReader();

          while (reader.Read())
          {
            teams.Add(reader["TeamId"].ToString());
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

      return teams;
    }

    [HttpGet("{userid}")]
    public List<Assignment> myassignments(string userid)
    {
      //https://localhost:5001/api/teams/myteams/0efcf86a-37da-48a7-8030-76afcaf88560
      List<Assignment> list = new List<Assignment>();

      MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
      using (connection)
      {
        MySqlCommand cmd = new MySqlCommand();

        try
        {
          connection.Open();
          cmd.Connection = connection;
          cmd.CommandText = "SELECT assignment.Id, assignment.CompanyId, company.Name, assignment.CategoryId, assignment.Title, assignment.Description FROM assignmentmember INNER JOIN assignment ON assignmentmember.AssignmentId  = assignment.Id RIGHT JOIN company ON assignment.CompanyId = company.Id WHERE TeamId IN (SELECT DISTINCT TeamId FROM teammember WHERE teammember.UserId = '"+userid+"') AND assignmentmember.Status = 1";

          cmd.Prepare();
          MySqlDataReader reader = cmd.ExecuteReader();

          while (reader.Read())
          {
            list.Add(new Assignment()
            {
              Id = reader["Id"].ToString(),
              CompanyId = reader["CompanyId"].ToString(),
              CompanyName = reader["Name"].ToString(),
              CategoryId = reader["CategoryId"].ToString(),
              Title = reader["Title"].ToString(),
              Description = reader["Description"].ToString()
            });
          }
          reader.Close();

        }
        catch (Exception e)
        {
          Console.WriteLine(e.ToString());
        }
        connection.Close();
      }

      return list;
    }

    [HttpGet("{userid}")]
    public List<Assignment> myassignmentrequests(string userid)
    {
      //https://localhost:5001/api/teams/myteams/0efcf86a-37da-48a7-8030-76afcaf88560
      List<Assignment> list = new List<Assignment>();

      MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
      using (connection)
      {
        MySqlCommand cmd = new MySqlCommand();

        try
        {
          connection.Open();
          cmd.Connection = connection;
          cmd.CommandText = "SELECT assignment.Id, assignment.CompanyId, company.Name, assignment.CategoryId, assignment.Title, assignment.Description FROM assignmentmember INNER JOIN assignment ON assignmentmember.AssignmentId  = assignment.Id RIGHT JOIN company ON assignment.CompanyId = company.Id WHERE TeamId IN (SELECT DISTINCT TeamId FROM teammember WHERE teammember.UserId = '"+userid+"') AND assignmentmember.Status = 2";

          cmd.Prepare();
          MySqlDataReader reader = cmd.ExecuteReader();

          while (reader.Read())
          {
            list.Add(new Assignment()
            {
              Id = reader["Id"].ToString(),
              CompanyId = reader["CompanyId"].ToString(),
              CompanyName = reader["Name"].ToString(),
              CategoryId = reader["CategoryId"].ToString(),
              Title = reader["Title"].ToString(),
              Description = reader["Description"].ToString()
            });
          }
          reader.Close();

        }
        catch (Exception e)
        {
          Console.WriteLine(e.ToString());
        }
        connection.Close();
      }

      return list;
    }

    [HttpGet("{companyId}")]
    public List<AssignmentRequest> IncomingAssignmentRequests(string companyId)
    {
      List<AssignmentRequest> list = new List<AssignmentRequest>();

      using (connection)
      {
        string sqlQuery = string.Format(@"SELECT am.Id AS Id, t.id AS TeamId, t.Name AS TeamName, a.Id AS AssignmentId, a.Title AS AssignmentTitle
          FROM team AS t
          LEFT JOIN assignmentmember AS am
          ON t.Id = am.TeamId
          LEFT JOIN assignment AS a
          ON a.Id = am.AssignmentId
          WHERE am.Status = 2 AND a.CompanyId = ""{0}"" ", companyId);

        MySqlCommand command = new MySqlCommand(sqlQuery, connection);

        try
        {
          connection.Open();
          command.Prepare();
          MySqlDataReader reader = command.ExecuteReader();

          while (reader.Read())
          {
            list.Add(

              new AssignmentRequest()
              {
                Id = reader["Id"].ToString(),
                TeamId = reader["TeamId"].ToString(),
                TeamName = reader["TeamName"].ToString(),
                AssignmentId = reader["AssignmentId"].ToString(),
                AssignmentTitle = reader["AssignmentTitle"].ToString(),
              }
            );
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

      return list;
    }

    [HttpGet("{companyId}")]
    public List<Assignment> ListAssignmentsOnCompany(string companyId)
    {
      List<Assignment> list = new List<Assignment>();

      using (connection)
      {
        string sqlQuery = $"SELECT * FROM `assignment` WHERE CompanyId = '{companyId}'";
        MySqlCommand command = new MySqlCommand(sqlQuery, connection);

        try
        {
          connection.Open();
          command.Prepare();
          MySqlDataReader reader = command.ExecuteReader();

          while (reader.Read())
          {

            list.Add(

              new Assignment()
              {
                Id = reader["Id"].ToString(),
                CompanyId = reader["CompanyId"].ToString(),
                Title = reader["Title"].ToString(),
                Description = reader["Description"].ToString(),
                TimePosted = reader.GetDateTime(reader.GetOrdinal("TimePosted")),
                Deadline = reader.GetDateTime(reader.GetOrdinal("Deadline")),
                Status = Convert.ToInt32(reader["Status"]),
              }
            );
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

      return list;
    }

  }
}