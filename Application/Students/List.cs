using System.Collections.Generic;
using System;
using MediatR;
using Domain;
using System.Threading;
using Persistence;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Application.Students
{
    public class List
    {
        public class Query : IRequest<List<Student>> { }

        public class Handler : IRequestHandler<Query, List<Student>> {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async System.Threading.Tasks.Task<List<Student>> Handle(Query request, CancellationToken cancellationToken)
            {
              //var students = await _context.Students.ToListAsync();
              var users = await _context.Users.Where(x => x.Role == 1).ToListAsync();

              var students = new List<Student>();

              foreach(var user in users)
              {
                students.Add(
                  new Student
                    {
                        Id = Guid.Parse(user.Id),
                        Username = user.UserName,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                    }
                  );
              }

              return students;
            }
        }

    }
}