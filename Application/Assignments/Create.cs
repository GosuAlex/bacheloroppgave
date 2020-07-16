// using System;
// using System.Threading;
// using System.Threading.Tasks;
// using Domain;
// using FluentValidation;
// using MediatR;
// using Persistence;

// namespace Application.Assignments
// {
//     public class Create
//     {
//         public class Command : IRequest
//         {
//             public Guid Id { get; set; }
//             public Guid CreatorId { get; set; }
//             public string Title { get; set; }
//             public string Content { get; set; }
//             public DateTime Deadline { get; set; }
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
//                 var assignment = new Assignment
//                 {
//                     Id = request.Id,
//                     CreatorId = request.CreatorId,
//                     Title = request.Title,
//                     Content = request.Content,
//                     Deadline = request.Deadline
//                 };

//                 _context.Assignments.Add(assignment);
//                 var success = await _context.SaveChangesAsync() > 0;

//                 if (success) return Unit.Value;

//                 throw new Exception("Problem saving changes");
//             }
//         }
//     }
// }