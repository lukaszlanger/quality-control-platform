﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using quality_control_platform_webapi.DataAccess;

namespace quality_control_platform_webapi.Migrations
{
    [DbContext(typeof(QualityControlPlatformDBContext))]
    [Migration("20220730214557_UpdateWorker1")]
    partial class UpdateWorker1
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.17")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("quality_control_platform_webapi.Models.ItemsDto", b =>
                {
                    b.Property<int>("ItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Manufacturer")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SerialNumber")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ItemId");

                    b.ToTable("Items");
                });

            modelBuilder.Entity("quality_control_platform_webapi.Models.ReportsDto", b =>
                {
                    b.Property<int>("ReportId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("ArchivingDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("CreationDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("DamageType")
                        .HasColumnType("int");

                    b.Property<int>("Decision")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsArchived")
                        .HasColumnType("bit");

                    b.Property<int>("ItemId")
                        .HasColumnType("int");

                    b.Property<string>("PhotosPath")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ReportAcceptance")
                        .HasColumnType("int");

                    b.Property<string>("Signature")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("WorkerId")
                        .HasColumnType("int");

                    b.HasKey("ReportId");

                    b.ToTable("Reports");
                });

            modelBuilder.Entity("quality_control_platform_webapi.Models.RolesDto", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ViewModel")
                        .HasColumnType("int");

                    b.HasKey("RoleId");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("quality_control_platform_webapi.Models.WorkersDto", b =>
                {
                    b.Property<int>("WorkerId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("IdentityNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsActive")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PIN")
                        .HasColumnType("int");

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.Property<string>("Surname")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("WorkerId");

                    b.ToTable("Workers");
                });
#pragma warning restore 612, 618
        }
    }
}
