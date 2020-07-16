using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.TeamRequests
{
    public class Details
    {
        public class Query : IRequest<TeamRequest>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, TeamRequest>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<TeamRequest> Handle(Query request, CancellationToken cancellationToken)
            {
                var TeamRequest = await _context.TeamRequests.FindAsync(request.Id);

                return TeamRequest;
            }
        }
    }
}
