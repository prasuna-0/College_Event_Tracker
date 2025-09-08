using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CET_Backend.Migrations
{
    /// <inheritdoc />
    public partial class VolunteerUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Volunteers_Users_SID",
                table: "Volunteers");

            migrationBuilder.AddForeignKey(
                name: "FK_Volunteers_Students_SID",
                table: "Volunteers",
                column: "SID",
                principalTable: "Students",
                principalColumn: "SID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Volunteers_Students_SID",
                table: "Volunteers");

            migrationBuilder.AddForeignKey(
                name: "FK_Volunteers_Users_SID",
                table: "Volunteers",
                column: "SID",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
