using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CET_Backend.Migrations
{
    /// <inheritdoc />
    public partial class Rolesremoved : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Admins_Roles_RId",
                table: "Admins");

            migrationBuilder.DropForeignKey(
                name: "FK_Coordinators_Roles_RId",
                table: "Coordinators");

            migrationBuilder.DropColumn(
                name: "CoordinatorName",
                table: "Coordinators");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "Coordinators");

            migrationBuilder.RenameColumn(
                name: "RId",
                table: "Coordinators",
                newName: "RoleRId");

            migrationBuilder.RenameIndex(
                name: "IX_Coordinators_RId",
                table: "Coordinators",
                newName: "IX_Coordinators_RoleRId");

            migrationBuilder.RenameColumn(
                name: "RId",
                table: "Admins",
                newName: "RoleRId");

            migrationBuilder.RenameIndex(
                name: "IX_Admins_RId",
                table: "Admins",
                newName: "IX_Admins_RoleRId");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Admins_Roles_RoleRId",
                table: "Admins");

            migrationBuilder.DropForeignKey(
                name: "FK_Coordinators_Roles_RoleRId",
                table: "Coordinators");

            migrationBuilder.RenameColumn(
                name: "RoleRId",
                table: "Coordinators",
                newName: "RId");

            migrationBuilder.RenameIndex(
                name: "IX_Coordinators_RoleRId",
                table: "Coordinators",
                newName: "IX_Coordinators_RId");

            migrationBuilder.RenameColumn(
                name: "RoleRId",
                table: "Admins",
                newName: "RId");

            migrationBuilder.RenameIndex(
                name: "IX_Admins_RoleRId",
                table: "Admins",
                newName: "IX_Admins_RId");

            migrationBuilder.AddColumn<string>(
                name: "CoordinatorName",
                table: "Coordinators",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Position",
                table: "Coordinators",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Admins_Roles_RId",
                table: "Admins",
                column: "RId",
                principalTable: "Roles",
                principalColumn: "RId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Coordinators_Roles_RId",
                table: "Coordinators",
                column: "RId",
                principalTable: "Roles",
                principalColumn: "RId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
