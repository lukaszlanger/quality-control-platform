using Microsoft.EntityFrameworkCore.Migrations;

namespace quality_control_platform_webapi.Migrations
{
    public partial class UpdateRoles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ViewModel",
                table: "Roles");

            migrationBuilder.AddColumn<string>(
                name: "RoleToken",
                table: "Roles",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RoleToken",
                table: "Roles");

            migrationBuilder.AddColumn<int>(
                name: "ViewModel",
                table: "Roles",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
