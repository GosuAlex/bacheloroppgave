using System.Collections.Generic;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using MySql.Data.MySqlClient;
using Application.Errors;
using System.Net;

namespace API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    [AllowAnonymous] // Bare for å fjerne autentisering. remove me later !!!!
    public class MessagesController : BaseController
    {

        // GET api/values
        [HttpGet("{userid}")]
        public List<Message> myinbox(string userid)
        {
            List<Message> list = new List<Message>();

            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {
                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "SELECT message.Id, message.SenderUserId, appuser.Email, appuser.FirstName, appuser.LastName, message.ReceiverUserId, message.Title, message.Content, message.Status, message.Date FROM message JOIN appuser ON message.SenderUserId = appuser.Id WHERE message.ReceiverUserId = '" + userid + "'";
                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new Message()
                        {
                            Id = reader["Id"].ToString(),
                            SenderUserId = reader["SenderUserId"].ToString(),
                            Email = reader["Email"].ToString(),
                            FirstName = reader["FirstName"].ToString(),
                            LastName = reader["LastName"].ToString(),
                            ReceiverUserId = reader["ReceiverUserId"].ToString(),
                            Title = reader["Title"].ToString(),
                            Content = reader["Content"].ToString(),
                            Date = reader["Date"].ToString(),
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
        public List<Message> myoutbox(string userid)
        {
            List<Message> list = new List<Message>();

            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {
                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "SELECT sentmessage.Id, sentmessage.SenderUserId, appuser.Email, appuser.FirstName, appuser.LastName, sentmessage.ReceiverUserId, sentmessage.Title, sentmessage.Content, sentmessage.Date FROM sentmessage JOIN appuser ON sentmessage.ReceiverUserId = appuser.Id WHERE sentmessage.SenderUserId = '" + userid + "'";
                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new Message()
                        {
                            Id = reader["Id"].ToString(),
                            SenderUserId = reader["SenderUserId"].ToString(),
                            Email = reader["Email"].ToString(),
                            FirstName = reader["FirstName"].ToString(),
                            LastName = reader["LastName"].ToString(),
                            ReceiverUserId = reader["ReceiverUserId"].ToString(),
                            Title = reader["Title"].ToString(),
                            Content = reader["Content"].ToString(),
                            Date = reader["Date"].ToString()
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


        [HttpGet("{Id}")]
        public List<Message> viewmessage(string id)
        {
            List<Message> list = new List<Message>();

            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {
                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "SELECT message.Id, message.Title, message.Content, message.Date, appuser.FirstName, appuser.LastName FROM message LEFT JOIN appuser ON message.SenderUserId = appuser.Id WHERE message.Id = '" + id + "'";
                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new Message()
                        {
                            Id = reader["Id"].ToString(),
                            Title = reader["Title"].ToString(),
                            Content = reader["Content"].ToString(),
                            Date = reader["Date"].ToString(),
                            FirstName = reader["FirstName"].ToString(),
                            LastName = reader["LastName"].ToString()
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
        [HttpGet("{Id}")]
        public List<Message> viewsentmessage(string id)
        {
            List<Message> list = new List<Message>();

            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {
                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "SELECT sentmessage.Id, sentmessage.Title, sentmessage.Content, sentmessage.Date, appuser.FirstName, appuser.LastName FROM sentmessage LEFT JOIN appuser ON sentmessage.ReceiverUserId = appuser.Id WHERE sentmessage.Id = '" + id + "'";
                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new Message()
                        {
                            Id = reader["Id"].ToString(),
                            Title = reader["Title"].ToString(),
                            Content = reader["Content"].ToString(),
                            Date = reader["Date"].ToString(),
                            FirstName = reader["FirstName"].ToString(),
                            LastName = reader["LastName"].ToString()
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

        [HttpDelete("{id}")]
        public void deletemessage(string id)
        {
            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {
                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "DELETE FROM message WHERE id ='"+id+"';";

               

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

        [HttpDelete("{id}")]
        public void deletesentmessage(string id)
        {
             MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {
                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "DELETE FROM sentmessage WHERE id ='"+id+"';";

                  

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

        public void createmessage(Message message)
        {
            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr; Allow User Variables=true");
            using (connection)
            {
                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "START TRANSACTION; SELECT Id INTO @userid FROM appuser WHERE Email = '"+message.Email.ToString()+"' LIMIT 1; INSERT INTO message (message.Id, message.SenderUserId, message.ReceiverUserId, message.Title, message.Content, message.Status) VALUES ('"+message.Id+"', '"+message.SenderUserId+"', @userid, '"+message.Title+"', '"+message.Content+"', 1); INSERT INTO sentmessage (sentmessage.Id, sentmessage.SenderUserId, sentmessage.ReceiverUserId, sentmessage.Title, sentmessage.Content) VALUES ('"+message.Id+"', '"+message.SenderUserId+"', @userid, '"+message.Title+"', '"+message.Content+"'); COMMIT;";

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

        /* [HttpGet("{userid}")]
        public List<Message> recipients(string userid)
        {
            List<Message> list = new List<Message>();

            MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
            using (connection)
            {
                MySqlCommand cmd = new MySqlCommand();

                try
                {
                    connection.Open();
                    cmd.Connection = connection;
                    cmd.CommandText = "SELECT appuser.Id, appuser.FirstName, appuser.LastName, appuser.Email FROM appuser WHERE appuser.Role = 1 AND <> '" + userid + "'";
                    cmd.Prepare();
                    MySqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        list.Add(new Message()
                        {
                            Id = reader["Id"].ToString(),
                            FirstName = reader["FirstName"].ToString(),
                            LastName = reader["LastName"].ToString(),
                            Email = reader["Email"].ToString()
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
        } */


    }
}
