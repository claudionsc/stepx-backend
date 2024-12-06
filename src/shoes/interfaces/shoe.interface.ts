import { ShoeDTO } from "../DTO/shoes"
import { Shoe } from "../models/shoe.model"

export interface IShoeQueryService {
    findAll(): Promise<Shoe[]>
    findOne(id: number): Promise<Shoe>
}

export interface IShowCommandService {
    create(shoeDTO: ShoeDTO): Promise<ShoeDTO>
    createMany(shoeList: ShoeDTO[]): Promise<void>
}