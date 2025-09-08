using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CET_Backend.Migrations
{
    /// <inheritdoc />
    public partial class Rolerem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Admins_Roles_RoleRId",
                table: "Admins");

            migrationBuilder.DropForeignKey(
                name: "FK_Coordinators_Roles_RoleRId",
                table: "Coordinators");

            migrationBuilder.DropIndex(
                name: "IX_Coordinators_RoleRId",
                table: "Coordinators");

            migrationBuilder.DropIndex(
                name: "IX_Admins_RoleRId",
                table: "Admins");

            migrationBuilder.DropColumn(
                name: "RoleRId",
                table: "Coordinators");

            migrationBuilder.DropColumn(
                name: "RoleRId",
                table: "Admins");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RoleRId",
                table: "Coordinators",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RoleRId",
                table: "Admins",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Coordinators_RoleRId",
                table: "Coordinators",
                column: "RoleRId");

            migrationBuilder.CreateIndex(
                name: "IX_Admins_RoleRId",
                table: "Admins",
                column: "RoleRId");

            migrationBuilder.AddForeignKey(
                name: "FK_Admins_Roles_RoleRId",
                table: "Admins",
                column: "RoleRId",
                principalTable: "Roles",
                principalColumn: "RId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Coordinators_Roles_RoleRId",
                table: "Coordinators",
                column: "RoleRId",
                principalTable: "Roles",
                principalColumn: "RId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
