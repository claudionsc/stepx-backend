import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Shoe } from "./models/shoe.model";

@Injectable()
export class ShoesService{
    constructor(
        @InjectModel(Shoe)
        private shoeModel: typeof Shoe
    ) {}

    async findAll(): Promise<Shoe[]>{
        return this.shoeModel.findAll();
    }

   findOne(id: number): Promise<Shoe>{
    return this.shoeModel.findOne({
        where: {
            id,
        },
    });
   }
}