using System.Collections.Generic;
using MediatR;
using Domain;
using System.Threading;
using Persistence;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using System;

namespace Application.Students
{
  public class Delete
  {

    public class Command : IRequest
    {
      public Guid Id { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      private readonly UserManager<User> _userManager;
      public Handler(DataContext context, UserManager<User> userManager)
      {
        _userManager = userManager;
        _context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        //var student = await _context.Students.FindAsync(request.Id);
        var user = await _userManager.FindByIdAsync(request.Id.ToString());

        if (user == null)
          throw new Exception("Could not find user");

        // _context.Remove(student);
        //var success = await _context.SaveChangesAsync() > 0;
        var result = await _userManager.DeleteAsync(user);

        if (result.Succeeded) return Unit.Value;

        throw new Exception("Could not delete");
      }
    }

  }
}