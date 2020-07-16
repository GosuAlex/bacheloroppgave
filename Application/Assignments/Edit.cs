// using System;
// using System.Net;
// using System.Threading;
// using System.Threading.Tasks;
// using Application.Errors;
// using FluentValidation;
// using MediatR;
// using Persistence;

// namespace Application.Assignments
// {
//     public class Edit
//     {
//         public class Command : IRequest
//         {
//             public Guid Id { get; set; }
//             public Guid CreatorId { get; set; }
//             public string Title { get; set; }
//             public string Content { get; set; }
//             public DateTime? Deadline { get; set; }
//         }

//         public class Handler : IRequestHandler<Command>
//         {
//             private readonly DataContext _context;
//             public Handler(DataContext context)
//             {
//                 _context = context;
//             }

//             public class CommandValidator : AbstractValidator<Command>
//             {
//                 public CommandValidator()
//                 {
//                     RuleFor(x => x.Title).NotEmpty();
//                     RuleFor(x => x.Content).NotEmpty();
//                     RuleFor(x => x.Deadline).NotEmpty();
//                 }
//             }

//             public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
//             {
//                 var assignment = await _context.Assignments.FindAsync(request.Id);
//                 if (assignment == null)
//                     throw new RestException(HttpStatusCode.NotFound, new { assignment = "Not found" });

//                 assignment.Title = request.Title ?? assignment.Title;
//                 assignment.Content = request.Content ?? assignment.Content;
//                 assignment.Deadline = request.Deadline ?? assignment.Deadline;

//                 var success = await _context.SaveChangesAsync() > 0;

//                 if (success) return Unit.Value;
//                 throw new Exception("Problem saving changes");
//             }
//         }
//     }
// }