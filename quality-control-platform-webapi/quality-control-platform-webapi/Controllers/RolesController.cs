using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quality_control_platform_webapi.DataAccess;
using quality_control_platform_webapi.Models;

namespace quality_control_platform_webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly QualityControlPlatformDBContext _context;

        public RolesController(QualityControlPlatformDBContext context)
        {
            _context = context;
        }

        // GET: api/Roles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RolesDto>>> GetRoles()
        {
            return await _context.Roles.ToListAsync();
        }

        // GET: api/Roles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RolesDto>> GetRolesDto(int id)
        {
            var rolesDto = await _context.Roles.FindAsync(id);

            if (rolesDto == null)
            {
                return NotFound();
            }

            return rolesDto;
        }

        // PUT: api/Roles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRolesDto(int id, RolesDto rolesDto)
        {
            if (id != rolesDto.RoleId)
            {
                return BadRequest();
            }

            _context.Entry(rolesDto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RolesDtoExists(id))
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

        // POST: api/Roles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RolesDto>> PostRolesDto(RolesDto rolesDto)
        {
            _context.Roles.Add(rolesDto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRolesDto", new { id = rolesDto.RoleId }, rolesDto);
        }

        // DELETE: api/Roles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRolesDto(int id)
        {
            var rolesDto = await _context.Roles.FindAsync(id);
            if (rolesDto == null)
            {
                return NotFound();
            }

            _context.Roles.Remove(rolesDto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RolesDtoExists(int id)
        {
            return _context.Roles.Any(e => e.RoleId == id);
        }
    }
}
