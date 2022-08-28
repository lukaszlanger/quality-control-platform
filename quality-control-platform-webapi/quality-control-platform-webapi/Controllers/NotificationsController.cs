using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quality_control_platform_webapi.DataAccess;
using quality_control_platform_webapi.Models;

namespace quality_control_platform_webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly QualityControlPlatformDBContext _context;

        public NotificationsController(QualityControlPlatformDBContext context)
        {
            _context = context;
        }

        // GET: api/Notifications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationsDto>>> GetNotifications()
        {
            return await _context.Notifications.ToListAsync();
        }

        // GET: api/Notifications/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NotificationsDto>> GetNotificationsDto(int id)
        {
            var notificationsDto = await _context.Notifications.FindAsync(id);

            if (notificationsDto == null)
            {
                return NotFound();
            }

            return notificationsDto;
        }

        // PUT: api/Notifications/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNotificationsDto(int id, NotificationsDto notificationsDto)
        {
            if (id != notificationsDto.NotificationId)
            {
                return BadRequest();
            }

            _context.Entry(notificationsDto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NotificationsDtoExists(id))
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

        // POST: api/Notifications
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<NotificationsDto>> PostNotificationsDto(NotificationsDto notificationsDto)
        {
            _context.Notifications.Add(notificationsDto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNotificationsDto", new { id = notificationsDto.NotificationId }, notificationsDto);
        }

        // DELETE: api/Notifications/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotificationsDto(int id)
        {
            var notificationsDto = await _context.Notifications.FindAsync(id);
            if (notificationsDto == null)
            {
                return NotFound();
            }

            _context.Notifications.Remove(notificationsDto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NotificationsDtoExists(int id)
        {
            return _context.Notifications.Any(e => e.NotificationId == id);
        }
    }
}
