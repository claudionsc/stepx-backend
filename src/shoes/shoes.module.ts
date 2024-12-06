import { Module } from "@nestjs/common";
import { ShoeController } from "./shoe.controller";
import { ShoesCommandService, ShoesQueryService } from "./shoes.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Shoe } from "./models/shoe.model";
import { Image } from "src/images/models/images.model";

@Module({

    imports: [
        SequelizeModule.forFeature([Shoe, Image]), // Registra os modelos no módulo
      ],
      providers: [ShoesCommandService, ShoesQueryService],
      exports: [ShoesCommandService, ShoesQueryService],
      controllers: [ShoeController]
})

export class ShoeModule {}