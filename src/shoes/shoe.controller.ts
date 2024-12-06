import { Body, Controller, Get, NotFoundException, Param, Post } from "@nestjs/common";
import { ShoesCommandService, ShoesQueryService } from "./shoes.service";
import { Shoe } from "./models/shoe.model";
import { ShoeDTO } from "./DTO/shoes";

@Controller('shoes')
export class ShoeController{
    constructor(
        private readonly shoesCommandService: ShoesCommandService,
        private readonly shoesQueryService: ShoesQueryService
    ) {}
   

    @Get()
    async findAll(): Promise<Shoe[]>{
        return this.shoesQueryService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Shoe>{
        const shoe = await this.shoesQueryService.findOne(id);

        if (!shoe) {
            throw new NotFoundException('This Post doesn\'t exist');
        }

        return shoe
    }

    @Post(  )
    async create(
        @Body() shoeDTO: ShoeDTO,
    ): Promise<Shoe>{
        return this.shoesCommandService.create(shoeDTO)
    }
}