using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
using System.Net;
using Application.Errors;

namespace Application.Students
{
    public class Details
    {
        public class Query : IRequest<Student>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Student>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Student> Handle(Query request, CancellationToken cancellationToken)
            {
                //var student = await _context.Students.FindAsync(request.Id);
                var user = await _context.Users.FindAsync(request.Id.ToString());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { student = "Not found" });

                var student = new Student
                {
                  Email = user.Email,
                  Username = user.UserName,
                  FirstName = user.FirstName,
                  LastName = user.LastName,
                  Id = Guid.Parse(user.Id),
                };

                return student;
            }
        }
    }
}