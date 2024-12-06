import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Shoe } from "./models/shoe.model";
import { Image } from "src/images/models/images.model";
import { Sequelize } from "sequelize-typescript";
import { ShoeDTO } from "./DTO/shoes";
import { ShoeList } from "./mock/shoe.mock";

// Seeder para inicialização de dados
@Injectable()
export class ShoeSeeder {
    constructor(
        @InjectModel(Shoe) private readonly shoeModel: typeof Shoe,
        @InjectModel(Image) private readonly imageModel: typeof Image,
        private readonly sequelize: Sequelize
    ) { }

    async seedDatabase(ShoeList: ShoeDTO[]): Promise<void> {

        try {
            await this.sequelize.transaction(async t => {
                const transactionHost = { transaction: t }

                for (let i = 0; i < ShoeList.length; i++) {
                    const shoeName = await this.shoeModel.create(
                        ShoeList[i]
                    )

                    await this.imageModel.bulkCreate(
                        [
                            { url: ShoeList[i].img.img01, shoeId: shoeName.id },
                            { url: ShoeList[i].img.img02, shoeId: shoeName.id },
                            { url: ShoeList[i].img.img03, shoeId: shoeName.id },
                            { url: ShoeList[i].img.img04, shoeId: shoeName.id },
                        ]
                    )
                }
            })
        } catch (err) {

            console.error('Erro ao criar os dados:', err);
        }
    }

}

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


    async onModuleInit() {
        // Verificar se existem dados na tabela e, caso não existam, criar
        const count = await this.shoeModel.count(); // Conta os registros
        if (count === 0) {
            console.log('Inicializando dados padrão...');
            const shoeSeeder = new ShoeSeeder(Shoe, Image, this.sequelize);
            await shoeSeeder.seedDatabase(ShoeList); // Executa a criação de dados
        } else {
            console.log('Dados já existentes no banco.');
        }
    }

    async findAll(): Promise<Shoe[]> {
        return this.shoeModel.findAll({
            include: [
                {
                    model: Image,  // Relacionamento com o modelo Image
                    required: false,  
                },
            ],
        });
    }


    findOne(id: number): Promise<Shoe> {
        return this.shoeModel.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: Image,
                    required: false,
                },
            ],
        });
    }
}

