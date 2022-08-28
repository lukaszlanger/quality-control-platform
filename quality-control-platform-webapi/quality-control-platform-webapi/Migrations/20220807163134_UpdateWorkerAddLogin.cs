using Microsoft.EntityFrameworkCore.Migrations;

namespace quality_control_platform_webapi.Migrations
{
    public partial class UpdateWorkerAddLogin : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Token",
                table: "Workers",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Token",
                table: "Workers");
        }
    }
}
