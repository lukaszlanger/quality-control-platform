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
    public class ItemsController : ControllerBase
    {
        private readonly QualityControlPlatformDBContext _context;

        public ItemsController(QualityControlPlatformDBContext context)
        {
            _context = context;
        }

        // GET: api/Items
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemsDto>>> GetItems()
        {
            return await _context.Items.ToListAsync();
        }

        // GET: api/Items/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ItemsDto>> GetItemsDto(int id)
        {
            var itemsDto = await _context.Items.FindAsync(id);

            if (itemsDto == null)
            {
                return NotFound();
            }

            return itemsDto;
        }

        // PUT: api/Items/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutItemsDto(int id, ItemsDto itemsDto)
        {
            if (id != itemsDto.ItemId)
            {
                return BadRequest();
            }

            _context.Entry(itemsDto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemsDtoExists(id))
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

        // POST: api/Items
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ItemsDto>> PostItemsDto(ItemsDto itemsDto)
        {
            _context.Items.Add(itemsDto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetItemsDto", new { id = itemsDto.ItemId }, itemsDto);
        }

        // DELETE: api/Items/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItemsDto(int id)
        {
            var itemsDto = await _context.Items.FindAsync(id);
            if (itemsDto == null)
            {
                return NotFound();
            }

            _context.Items.Remove(itemsDto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ItemsDtoExists(int id)
        {
            return _context.Items.Any(e => e.ItemId == id);
        }
    }
}
