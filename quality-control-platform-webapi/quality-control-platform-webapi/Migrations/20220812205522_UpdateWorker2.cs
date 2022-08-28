using Microsoft.EntityFrameworkCore.Migrations;

namespace quality_control_platform_webapi.Migrations
{
    public partial class UpdateWorker2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PIN",
                table: "Workers");

            migrationBuilder.DropColumn(
                name: "Supervisor",
                table: "Workers");

            migrationBuilder.RenameColumn(
                name: "Token",
                table: "Workers",
                newName: "Email");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Workers",
                newName: "Token");

            migrationBuilder.AddColumn<int>(
                name: "PIN",
                table: "Workers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Supervisor",
                table: "Workers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
