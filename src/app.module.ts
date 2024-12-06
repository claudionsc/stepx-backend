import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShoeModule } from './shoes/shoes.module';
import { Shoe } from './shoes/models/shoe.model';
import { Image } from './images/models/images.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost', // Use o nome do serviço no Docker Compose
      port: 5432,
      username: 'user',
      password: 'admin',
      database: 'stepx-db',
      logging: true,
      autoLoadModels: true,
      synchronize: true,
    }),
    
    ShoeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
