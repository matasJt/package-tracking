using Application.Dto;
using Application.Services;
using Microsoft.AspNetCore.Mvc;
namespace Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PackageController(PackageService packageService) : ControllerBase
    {
        [HttpGet("{packageId}")]
        public async Task<IActionResult> GetPackage(Guid packageId)
        {
            var package = await packageService.GetPackage(packageId);
            if (package == null)
            {
                return NotFound();
            }
            return Ok(package);
        }

        [HttpGet("{packageId}/History")]
        public async Task<IActionResult> GetPackageHistory(Guid packageId)
        {
           var packageHistory = await packageService.GetPackageHistory(packageId);
           if (packageHistory == null)
           {
               return NotFound();
           }
           return Ok(packageHistory);
        }
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page, [FromQuery] string status = "", [FromQuery] string trackingNumber = "")
        {
            return Ok(await packageService.GetPackages(page,status, trackingNumber));
        }

        [HttpPost]
        public async Task<IActionResult> CreatePackage(CreatePackageDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var packageDto = await packageService.CreatePackage(dto);

            return Created($"/api/Package/{packageDto.TrackingNumber}",packageDto);
        }

        [HttpPut("{packageId}")]
        public async Task<IActionResult> UpdatePackage(Guid packageId,[FromQuery] string status)
        {
           var updatedPackage = await packageService.UpdatePackageStatus(packageId,status);
           if (updatedPackage.Success != true)
           {
               return BadRequest(new  {message = updatedPackage.Message});
           }
           return Ok(updatedPackage);
        }
    }
}
