import { Module } from "@nestjs/common";
import { ShoeController } from "./shoe.controller";
import { ShoesService } from "./shoes.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Shoe } from "./models/shoe.model";
import { Image } from "src/images/models/images.model";

@Module({

    imports: [
        SequelizeModule.forFeature([Shoe, Image]), // Registra os modelos no módulo
      ],
      providers: [ShoesService],
      exports: [ShoesService],
      controllers: [ShoeController]
})

export class ShoeModule {}