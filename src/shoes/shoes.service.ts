import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Shoe } from "./models/shoe.model";
import { Image } from "src/images/models/images.model";
import { Sequelize } from "sequelize-typescript";
import { ShoeDTO } from "./DTO/shoes";

@Injectable()
export class ShoesService implements OnModuleInit {

    constructor(
        @InjectModel(Shoe) private readonly shoeModel: typeof Shoe, // Modelo Shoe
        @InjectModel(Image) private readonly imageModel: typeof Image, // Modelo Image
        private readonly sequelize: Sequelize // Sequelize para transações
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

            console.error('Erro ao criar os dados:', err);
        }
    }

    async onModuleInit() {
        // Verificar se existem dados na tabela e, caso não existam, criar
        const count = await this.shoeModel.count(); // Conta os registros
        if (count === 0) {
          console.log('Inicializando dados padrão...');
          await this.createMany(); // Executa a criação de dados
        } else {
          console.log('Dados já existentes no banco.');
        }
      } 

      async findAll(): Promise<Shoe[]> {
        return this.shoeModel.findAll({
            include: [
                {
                    model: Image,  // Relacionamento com o modelo Image
                    required: false,  // As imagens não são obrigatórias, então pode ser false
                },
            ],
        });
    }
    

    findOne(id: number): Promise<Shoe> {
        return this.shoeModel.findOne({
            where: {
                id,
            },
        });
    }
}