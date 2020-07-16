using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.TeamRequests;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamRequestController : BaseController
    {
        private readonly IMediator _mediator;
        public TeamRequestController(IMediator mediator)
        {
            _mediator = mediator;
        }

    }
}