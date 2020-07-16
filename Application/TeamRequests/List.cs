using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.TeamRequests
{
    public class List
    {
        public class Query : IRequest<List<TeamRequest>> { }

        public class Handler : IRequestHandler<Query, List<TeamRequest>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<TeamRequest>> Handle(Query request, CancellationToken cancellationToken)
            {
                var teamRequests = await _context.TeamRequests.ToListAsync();

                return teamRequests;
            }
        }
    }
}