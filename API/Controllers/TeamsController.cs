using System.Collections.Generic;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using MySql.Data.MySqlClient;

namespace API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [AllowAnonymous] // Bare for å fjerne autentisering. remove me later !!!!

    public class TeamsController : ControllerBase
    {

        //Returns array of teams you are in
        [HttpGet("{userid}")]
        public List<Team> myteams(string userid)
        {
            //https://localhost:5001/api/teams/myteams/0efcf86a-37da-48a7-8030-76afcaf88560
            List<Team> list = new List<Team>();

            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {
                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "SELECT * FROM team INNER JOIN teammember on team.Id = teammember.teamid WHERE teammember.userid = '" + userid + "' AND teammember.Status = 1";
                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new Team()
                        {
                            Id = reader["Id"].ToString(),
                            Name = reader["Name"].ToString(),
                            Description = reader["Description"].ToString(),
                            UserId = reader["UserId"].ToString(),
                            Status = reader["Status"].ToString()

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
        public List<Team> publicteams(string userid)
        {
            //https://localhost:5001/api/teams/myteams/0efcf86a-37da-48a7-8030-76afcaf88560
            List<Team> list = new List<Team>();

            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {
                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "SELECT DISTINCT team.Id, team.Name, team.Description, team.UserId, team.Status FROM teammember JOIN team on teammember.TeamId = team.Id WHERE team.Id NOT IN (SELECT DISTINCT teammember.TeamId FROM teammember WHERE teammember.UserId = '"+userid+"' AND teammember.Status = 1) AND team.Status = 2;";
                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new Team()
                        {
                            Id = reader["Id"].ToString(),
                            Name = reader["Name"].ToString(),
                            Description = reader["Description"].ToString(),
                            UserId = reader["UserId"].ToString(),
                            Status = reader["Status"].ToString()

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

        //Returns array of accepted team members
        [HttpGet("{teamid}")]
        public List<TeamMember> teammembers(string teamid)
        {
            Console.WriteLine("TEAM MEMBERS FOR TEAM " + teamid);
            //https://localhost:5001/api/teams/myteams/0efcf86a-37da-48a7-8030-76afcaf88560
            List<TeamMember> list = new List<TeamMember>();

            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {
                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "SELECT * FROM teammember INNER JOIN appuser on teammember.UserId = appuser.Id INNER JOIN team ON teammember.TeamId = team.Id WHERE teammember.TeamId = '" + teamid + "' AND teammember.Status = 1;";
                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new TeamMember()
                        {
                            TeamId = reader["TeamId"].ToString(),
                            TeamName = reader["Name"].ToString(),
                            UserId = reader["UserId"].ToString(),
                            Email = reader["Email"].ToString(),
                            FirstName = reader["FirstName"].ToString(),
                            LastName = reader["LastName"].ToString(),
                            Status = reader["Status"].ToString(),
                            ImagePath = reader["ImagePath"].ToString()

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

        //Returns array of users that have requested to join a team you are part of
        [HttpGet("{userid}")]
        public List<TeamMember> requests(string userid)
        {

            List<TeamMember> list = new List<TeamMember>();

            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {
                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "SELECT teammember.TeamId, team.Name, teammember.UserId, appuser.Email, appuser.FirstName, appuser.LastName, teammember.Status, appuser.ImagePath FROM teammember INNER JOIN team on teammember.TeamId = team.Id INNER JOIN appuser ON teammember.UserId = appuser.Id WHERE teammember.TeamId IN (SELECT teammember.TeamId FROM teammember WHERE teammember.UserId = '" + userid + "' AND teammember.Status = 1) AND teammember.Status = 3;";
                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new TeamMember()
                        {
                            TeamId = reader["TeamId"].ToString(),
                            TeamName = reader["Name"].ToString(),
                            UserId = reader["UserId"].ToString(),
                            Email = reader["Email"].ToString(),
                            FirstName = reader["FirstName"].ToString(),
                            LastName = reader["LastName"].ToString(),
                            Status = reader["Status"].ToString(),
                            ImagePath = reader["ImagePath"].ToString()

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

        //Returns array of users that have requested to join a team you are part of
        [HttpGet("{userid}")]
        public List<TeamMember> requestsPending(string userid)
        {

            List<TeamMember> list = new List<TeamMember>();

            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {
                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "SELECT `TeamId`, `UserId`, `Status` FROM `teammember` WHERE UserId = '" + userid + "' AND Status = 3 ;";
                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new TeamMember()
                        {
                            TeamId = reader["TeamId"].ToString(),
                            UserId = reader["UserId"].ToString(),
                            Status = reader["Status"].ToString(),

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

        //Returns array of team invites a user has
        [HttpGet("{userid}")]
        public List<TeamMember> invites(string userid)
        {

            List<TeamMember> list = new List<TeamMember>();

            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {
                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "SELECT * FROM teammember INNER JOIN appuser on teammember.UserId = appuser.Id INNER JOIN team ON teammember.TeamId = team.Id WHERE teammember.UserId = '" + userid + "' AND teammember.Status = 2;"; ;
                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new TeamMember()
                        {
                            TeamId = reader["TeamId"].ToString(),
                            TeamName = reader["Name"].ToString(),
                            UserId = reader["UserId"].ToString(),
                            Email = reader["Email"].ToString(),
                            FirstName = reader["FirstName"].ToString(),
                            LastName = reader["LastName"].ToString(),
                            Status = reader["Status"].ToString(),
                            ImagePath = reader["ImagePath"].ToString()

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


        [HttpPost]
        public void accept(TeamMember input)
        {

            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {

                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "UPDATE teammember SET Status = 1 WHERE TeamId = '" + input.TeamId + "' AND UserId = '" + input.UserId + "'";

                    Console.WriteLine(cmd.CommandText);

                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                    }
                    reader.Close();


                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }

                connection.Close();
            }
        }

        [HttpPost]
        public void deny(TeamMember input)
        {

            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {

                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "DELETE FROM teammember WHERE TeamId = '" + input.TeamId + "' AND UserId = '" + input.UserId + "'";

                    Console.WriteLine(cmd.CommandText);

                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                    }
                    reader.Close();


                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }

                connection.Close();
            }
        }

        //Removes member from team
        [HttpPost]
        public void leaveteam(TeamMember input)
        {

            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {

                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "DELETE FROM teammember WHERE TeamId = '" + input.TeamId + "' AND UserId = '" + input.UserId + "';";

                    Console.WriteLine(cmd.CommandText);

                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                    }
                    reader.Close();


                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }

                connection.Close();
            }
        }


        //Invite a user to your team
        [HttpPost]
        public void invite(TeamMember input)
        {

            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr; Allow User Variables=true");
            using (connection)
            {

                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "START TRANSACTION; SELECT Id INTO @userid FROM appuser WHERE Email = '" + input.Email.ToString() + "' LIMIT 1; INSERT INTO teammember VALUES ('" + System.Guid.NewGuid() + "', '" + input.TeamId.ToString() + "', @userid, 2); COMMIT;";
                    Console.WriteLine(cmd.CommandText);

                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                    }
                    reader.Close();

                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }

                connection.Close();
            }
        }


        //Make a request to join a team
        [HttpPost]
        public void join(TeamMember input)
        {

            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {

                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "INSERT INTO teammember VALUES ('" + System.Guid.NewGuid() + "', '" + input.TeamId + "', '" + input.UserId + "', 3)";

                    Console.WriteLine(cmd.CommandText);

                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                    }
                    reader.Close();


                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }

                connection.Close();
            }
        }

        [HttpPost]
        public void createteam(Team team)
        {
            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {

                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "START TRANSACTION; INSERT INTO team VALUES ('" + team.Id.ToString() + "', '" + team.Name.ToString() + "', '" + team.UserId.ToString() + "', '" + team.Description.ToString() + "', " + team.Status.ToString() + "); INSERT INTO teammember VALUES ('" + System.Guid.NewGuid() + "', '" + team.Id.ToString() + "', '" + team.UserId + "', 1); COMMIT;";

                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                    }
                    reader.Close();


                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }

                connection.Close();
            }
        }

        [HttpPost]
        public void setstatus(Team team)
        {
            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {

                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "UPDATE team SET Status = " + team.Status+ " WHERE Id = '"+ team.Id +"';";

                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                    }
                    reader.Close();


                }
                catch (Exception e)
                {
                    Console.WriteLine(e.ToString());
                }

                connection.Close();
            }
        }

    }
}

/* 
[HttpGet("{id}")] 
[HttpPost]
[HttpPut("{id}")]
[HttpDelete("{id}")]
*/
