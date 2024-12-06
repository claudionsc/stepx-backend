import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Shoe } from "./models/shoe.model";
import { Image } from "src/images/models/images.model";
import { Sequelize } from "sequelize-typescript";
import { ShoeDTO } from "./DTO/shoes";

@Injectable()
export class ShoesService {

    constructor(
        @InjectModel(Shoe)
        private sequelize: Sequelize,
        private shoeModel: typeof Shoe,
        private readonly imageModel: typeof Image,
    ) { }

    create(ShoeDTO: ShoeDTO): Promise<Shoe> {
        return this.shoeModel.create({
            key: ShoeDTO.key,
            nome: ShoeDTO.nome,
            preco: ShoeDTO.preco,
            img: ShoeDTO.img,
            tamanhos: ShoeDTO.tamanhos
        })
    }

    async createMany() {
        try {
            await this.sequelize.transaction(async t => {
                const transactionHost = { transaction: t }

                // newbalance550

                const newbalance550 = await this.shoeModel.create(
                    { key: 'newbalance-550', nome: 'Tênis New Balance 550 Masculino', preco: 999.99, tamanhos: [35, 36, 37, 38, 39, 40, 41, 42, 43] },
                    transactionHost,
                )

                await this.imageModel.bulkCreate(
                    [
                        { url: 'NB01', shoeId: newbalance550.id },
                        { url: 'NB02', shoeId: newbalance550.id },
                        { url: 'NB03', shoeId: newbalance550.id },
                        { url: 'NB04', shoeId: newbalance550.id },
                    ],
                    transactionHost,
                );

                const nikeMethod = await this.shoeModel.create(
                    { key: 'nike-metcon8', nome: 'Tênis Nike Metcon 8 Masculino', preco: 1299.99, tamanhos: [36, 37, 38, 39, 40, 41, 42, 43, 44, 46] },
                    transactionHost,
                )

                await this.imageModel.bulkCreate(
                    [
                        { url: 'NKMET801', shoeId: nikeMethod.id },
                        { url: 'NKMET801', shoeId: nikeMethod.id },
                        { url: 'NKMET801', shoeId: nikeMethod.id },
                        { url: 'NKMET801', shoeId: nikeMethod.id },
                    ],
                    transactionHost,
                );
            })
        } catch (err) {
            // Transaction has been rolled back
            // err is whatever rejected the promise chain returned to the transaction callback

            console.error('Erro ao criar os dados:', err);
        }
    }

    async findAll(): Promise<Shoe[]> {
        return this.shoeModel.findAll();
    }

    findOne(id: number): Promise<Shoe> {
        return this.shoeModel.findOne({
            where: {
                id,
            },
        });
    }
}