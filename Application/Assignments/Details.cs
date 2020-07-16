using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Persistence;

namespace Application.Assignments
{
    public class Details
    {
        public class Query : IRequest<Assignment>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Assignment>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Assignment> Handle(Query request, CancellationToken cancellationToken)
            {
                var assignment = await _context.Assignments.FindAsync(request.Id);

                if (assignment == null)
                    throw new RestException(HttpStatusCode.NotFound, new { assignment = "Not found" });

                return assignment;
            }
        }
    }
}
