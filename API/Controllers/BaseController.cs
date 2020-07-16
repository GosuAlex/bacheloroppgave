using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using MySql.Data.MySqlClient;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseController : ControllerBase
    {
        private IMediator _mediator;
        protected IMediator Mediator => _mediator ?? (_mediator = HttpContext.RequestServices.GetService<IMediator>());
        protected MySqlConnection connection = new MySqlConnection("Database=daedalusdb; Data Source=projectdaedalus.mysql.database.azure.com; User Id=daedalus@projectdaedalus; Password=xDEvk7Cr");
    }
}