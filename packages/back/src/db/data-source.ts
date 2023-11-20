import { DataSource, DataSourceOptions } from "typeorm";

export const postgresDataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    username: 'root',
    password: 'root',
    database: 'getmint_db',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    migrationsRun: true,
    // synchronize: false
};

export default new DataSource(postgresDataSourceOptions);