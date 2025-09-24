using CET_Backend.Data;
using CET_Backend.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CET_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlbumsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public AlbumsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateOrAddToAlbum([FromForm] string name, IFormFile image)
        {
            if (string.IsNullOrEmpty(name))
                return BadRequest("Album name is required.");

            if (image == null || image.Length == 0)
                return BadRequest("No image uploaded.");

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            var photo = new Photo
            {
                FileName = image.FileName,
                FilePath = "/uploads/" + uniqueFileName,
                UploadedAt = DateTime.Now,
                Url = $"{Request.Scheme}://{Request.Host}/uploads/{uniqueFileName}"
            };

            var album = await _context.Albums
                .Include(a => a.Photos)
                .FirstOrDefaultAsync(a => a.Name.ToLower() == name.ToLower());

            if (album != null)
            {
                album.Photos.Add(photo);
                _context.Albums.Update(album);
            }
            else
            {
                album = new Album
                {
                    Name = name,
                    CreatedAt = DateTime.Now,
                    Photos = new List<Photo> { photo }
                };
                _context.Albums.Add(album);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                album.Id,
                album.Name,
                album.CreatedAt,
                Photos = album.Photos.Select(p => new
                {
                    p.Id,
                    p.FileName,
                    p.FilePath,
                    p.Url,
                    p.UploadedAt
                })
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAlbums()
        {
            var albums = await _context.Albums
                .Include(a => a.Photos)
                .ToListAsync();
            return Ok(albums);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAlbumById(int id)
        {
            var album = await _context.Albums
                .Include(a => a.Photos)
                .Select(a => new
                {
                    a.Id,
                    a.Name,
                    a.CreatedAt,
                    Photos = a.Photos.Select(p => new
                    {
                        p.Id,
                        p.FileName,
                        p.FilePath,
                        p.Url,
                        p.UploadedAt
                    })
                })
                .FirstOrDefaultAsync(a => a.Id == id);

            if (album == null)
                return NotFound(new { message = "Album not found" });

            return Ok(album);
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlbum(int id)
        {
            var album = await _context.Albums.Include(a => a.Photos).FirstOrDefaultAsync(a => a.Id == id);
            if (album == null) return NotFound();

            foreach (var photo in album.Photos)
            {
                var filePath = Path.Combine(_env.WebRootPath ?? "wwwroot", photo.FilePath.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);
            }

            _context.Albums.Remove(album);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Album deleted successfully" });
        }
    }
}
