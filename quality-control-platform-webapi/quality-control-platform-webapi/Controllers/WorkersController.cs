using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using quality_control_platform_webapi.DataAccess;
using quality_control_platform_webapi.Models;

namespace quality_control_platform_webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkersController : ControllerBase
    {
        private readonly QualityControlPlatformDBContext _context;

        public WorkersController(QualityControlPlatformDBContext context)
        {
            _context = context;
        }

        // GET: api/Workers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkersDto>>> GetWorkers()
        {
            return await _context.Workers.ToListAsync();
        }

        // GET: api/Workers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WorkersDto>> GetWorkersDto(int id)
        {
            var workersDto = await _context.Workers.FindAsync(id);

            if (workersDto == null)
            {
                return NotFound();
            }

            return workersDto;
        }

        // PUT: api/Workers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorkersDto(int id, WorkersDto workersDto)
        {
            if (id != workersDto.WorkerId)
            {
                return BadRequest();
            }

            _context.Entry(workersDto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorkersDtoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Workers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<WorkersDto>> PostWorkersDto(WorkersDto workersDto)
        {
            _context.Workers.Add(workersDto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWorkersDto", new { id = workersDto.WorkerId }, workersDto);
        }

        // DELETE: api/Workers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkersDto(int id)
        {
            var workersDto = await _context.Workers.FindAsync(id);
            if (workersDto == null)
            {
                return NotFound();
            }

            _context.Workers.Remove(workersDto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WorkersDtoExists(int id)
        {
            return _context.Workers.Any(e => e.WorkerId == id);
        }
    }
}
