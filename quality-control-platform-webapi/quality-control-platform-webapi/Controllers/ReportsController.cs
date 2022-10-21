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
    public class ReportsController : ControllerBase
    {
        private readonly QualityControlPlatformDBContext _context;

        public ReportsController(QualityControlPlatformDBContext context)
        {
            _context = context;
        }

        // GET: api/Reports
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReportsDto>>> GetReports()
        {
            return await _context.Reports.ToListAsync();
        }

        // GET: api/Reports/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReportsDto>> GetReportsDto(int id)
        {
            var reportsDto = await _context.Reports.FindAsync(id);

            if (reportsDto == null)
            {
                return NotFound();
            }

            return reportsDto;
        }

        // PUT: api/Reports/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754


        [HttpPut("{id}")]
        public async Task<IActionResult> PutReportsDto(int id, ReportsDto reportsDto)
        {
            if (id != reportsDto.ReportId)
            {
                return BadRequest();
            }

            _context.Entry(reportsDto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReportsDtoExists(id))
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

        // POST: api/Reports
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ReportsDto>> PostReportsDto(ReportsDto reportsDto)
        {
            _context.Reports.Add(reportsDto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReportsDto", new { id = reportsDto.ReportId }, reportsDto);
        }

        // DELETE: api/Reports/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReportsDto(int id)
        {
            var reportsDto = await _context.Reports.FindAsync(id);
            if (reportsDto == null)
            {
                return NotFound();
            }

            _context.Reports.Remove(reportsDto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReportsDtoExists(int id)
        {
            return _context.Reports.Any(e => e.ReportId == id);
        }
    }
}
