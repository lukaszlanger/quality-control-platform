using Microsoft.EntityFrameworkCore.Migrations;

namespace quality_control_platform_webapi.Migrations
{
    public partial class UpdateWorker1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PIN",
                table: "Workers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PIN",
                table: "Workers");
        }
    }
}
