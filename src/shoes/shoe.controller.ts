import { Body, Controller, Get, NotFoundException, Param, Post } from "@nestjs/common";
import { ShoesService } from "./shoes.service";
import { Shoe } from "./models/shoe.model";
import { ShoeDTO } from "./DTO/shoes";

@Controller()
export class ShoeController{
    constructor(private readonly shoesService: ShoesService) {}

    @Get('/shoes')
    async finAll(): Promise<Shoe[]>{
        return this.shoesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Shoe>{
        const shoe = await this.shoesService.findOne(id);

        if (!shoe) {
            throw new NotFoundException('This Post doesn\'t exist');
        }

        return shoe
    }

    @Post('/shoes')
    async create(
        @Body() shoeDTO: ShoeDTO,
    ): Promise<Shoe>{
        return this.shoesService.create(shoeDTO)
    }
}