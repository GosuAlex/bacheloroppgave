using System.Collections.Generic;
using MediatR;
using Domain;
using System.Threading;
using Persistence;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;

namespace Application.Students
{
    public class Edit
    {

        public class Command : IRequest
        {
            public Guid Id { get; set; } 
            public string Email { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Password { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var student = await _context.Students.FindAsync(request.Id);

                if (student == null)
                    throw new Exception("Could not find student");

                student.Email = request.Email ?? student.Email;
                student.FirstName = request.FirstName ?? student.FirstName;
                student.LastName = request.LastName ?? student.LastName;
                student.Password = request.Password ?? student.Password;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Could not save");
            }
        }

    }
}