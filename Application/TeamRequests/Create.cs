using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.TeamRequests
{
    public class Create
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public Guid TeamId { get; set; }
            public Guid UserId { get; set; }
            public int Status { get; set; }
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
                var teamRequest = new TeamRequest
                {
                    Id = request.Id,
                    TeamId = request.TeamId,
                    UserId = request.UserId,
                    Status = request.Status
                };

                _context.TeamRequests.Add(teamRequest);
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}