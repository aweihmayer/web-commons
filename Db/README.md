# Database
This library uses Entity Framework Core as its ORM.

## Creating a new database
- Open *Tools > NuGet Package Manager > Package Manager Console*
- Execute *Add-Migration InitialCreate*
- Execute *Update-Database*

## Recreating a database
- Delete the database
- Delete migrations
- Execute steps for *Creating a new database*

## Migrating to a new schema version
- Open *Tools > NuGet Package Manager > Package Manager Console* 
- Execute *Add-Migration MIGRATION_NAME*
- Execute *Update-Database*