import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { postgresDataSourceOptions } from "./db/data-source";

@Module({
  imports: [
    TypeOrmModule.forRoot(postgresDataSourceOptions)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
