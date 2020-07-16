using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Assignments
{
    public class List
    {
        public class Query : IRequest<List<Assignment>> { }

        public class Handler : IRequestHandler<Query, List<Assignment>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Assignment>> Handle(Query request, CancellationToken cancellationToken)
            {
                var assignments = await _context.Assignments.ToListAsync();

                return assignments;
            }
        }
    }
}