# Datatabase designer

Idunno, I needed a good database designer, so here's one

## Starting the project
- Make sure you have [mysql](https://dev.mysql.com/doc/mysql-installation-excerpt/5.7/en/) set up
- copy `.env-example` to `.env` and edit the variables to suit
- run `yarn` in each of the folders to install dependencies
- `yarn sequelize-cli db:create` to create the database
- `yarn sequelize-cli db:migrate` and `yarn sequelize-cli db:seed:all` to migrate and seed the database
- run `yarn start` in `api` and `frontend` to start the project
- Make sure to configure your editor to run `eslint --fix` on save, it can be such a pain fixing endless linting errors

## Useful commands
- `yarn start` to run the project
- `yarn sequelize-cli` to work with the database, namely `db:migrate` and `db:seed:all`, with `migration:generate --name blabla` to create a migration and similar syntax for the seeder
- `yarn lint` to check for linting errors
- `yarn format` to format everything with prettier